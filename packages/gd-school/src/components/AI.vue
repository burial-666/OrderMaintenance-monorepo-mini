<script setup>
import { ref, nextTick, onMounted } from "vue";
import useLoginStore from "../store/login";
import { useRouter } from "vue-router";
const router = useRouter();
const isoverlay = ref(false);
const message = ref("");
const chatHistory = ref([]);
const conversationHistory = ref([]);
const chatContainerRef = ref(null);
const isProcessing = ref(false); // 添加处理状态标记
const popupLeave = ref(false);
const ispopup = ref(false);
const chatRecords = ref([]); // 确保初始化为空数组
const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

// 修改打开弹窗的逻辑
const openPopup = () => {
  isoverlay.value = true;
  ispopup.value = true;
};

// 修改关闭弹窗的逻辑
const closeOverlay = () => {
  popupLeave.value = true;
  setTimeout(() => {
    popupLeave.value = false;
    ispopup.value = false;
    isoverlay.value = false;
  }, 480);
};

// 添加新的响应式变量
const keepMessageNum = ref(20); // 可配置的消息保留数量
const currentSessionId = ref(null); // 当前会话ID

// 修改 onMounted 钩子，在组件挂载时创建新会话
onMounted(async () => {
  loadChatRecords();
  await createNewSession(); // 创建初始会话
  chatHistory.value.push({
    text: "你好~我是工单维保系统AI对话助手，有什么我可以帮助你的吗？",
    isUser: false,
    isLoading: false,
  });
});

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  });
};

// 修改 createNewSession 函数
const createNewSession = async () => {
  try {
    const response = await fetch("/api/chat/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: useLoginStore().token,
      },
      body: JSON.stringify({
        title: "新会话",
        user_id: Number(useLoginStore().user_id),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      currentSessionId.value = data.id;
      chatHistory.value = [];
      return data.id;
    }
  } catch (error) {
    console.error("创建会话失败:", error);
    handleError(error);
  }
};

// 修改 sendMessage 函数中的请求部分
const sendMessage = async () => {
  if (message.value.trim() === "" || isProcessing.value) return;

  isProcessing.value = true;
  const userMessage = message.value;
  message.value = "";

  // 添加用户消息
  const currentTime = new Date();
  const newMessage = {
    text: userMessage,
    isUser: true,
    timestamp: currentTime,
    time: formatTime(currentTime),
    type: "text",
  };

  chatHistory.value.push(newMessage);
  saveToHistory(newMessage);

  // 添加AI响应占位符
  const loadingMessageIndex = chatHistory.value.length;
  chatHistory.value.push({
    text: "正在思考",
    isUser: false,
    isLoading: true,
    type: "text",
  });

  scrollToBottom();

  try {
    // 如果没有当前会话ID，先创建一个新会话
    if (!currentSessionId.value) {
      await createNewSession();
    }

    const response = await fetch("/api/api/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: useLoginStore().token,
      },
      body: JSON.stringify({
        keepMessageNum: 10,
        message: userMessage,
        sessionId: String(currentSessionId.value),
      }),
    });

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let accumulatedMessage = "";
      let isTyping = false;

      // 改进的流式响应处理
      const processStream = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            let newlineIndex;
            while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
              const line = buffer.slice(0, newlineIndex).trim();
              buffer = buffer.slice(newlineIndex + 1);

              if (line.startsWith("{")) {
                try {
                  const jsonResponse = JSON.parse(line);
                  if (jsonResponse.data?.data?.content) {
                    const content = jsonResponse.data.data.content;

                    // 确保不重复添加内容
                    if (!accumulatedMessage.includes(content)) {
                      const newContent = content.slice(accumulatedMessage.length);
                      accumulatedMessage = content;

                      // 等待前一段文字打字完成
                      if (isTyping) continue;
                      isTyping = true;

                      // 对新增的内容使用打字机效果
                      typewriterEffect(newContent, (typedText) => {
                        chatHistory.value[loadingMessageIndex] = {
                          text:
                            accumulatedMessage.slice(0, -newContent.length) + typedText,
                          isUser: false,
                          isLoading: false,
                          type: "text",
                          timestamp: new Date(),
                          time: formatTime(new Date()),
                        };

                        if (typedText === newContent) {
                          isTyping = false;
                        }
                        scrollToBottom();
                      });
                    }
                  }
                } catch (e) {
                  console.error("解析响应JSON失败:", e);
                }
              }
            }
          }
        } catch (error) {
          console.error("处理流数据时出错:", error);
          throw error;
        }
      };

      await processStream();

      // 保存最终的AI回复到历史记录
      if (accumulatedMessage) {
        const aiResponse = {
          text: accumulatedMessage,
          isUser: false,
          timestamp: new Date(),
          time: formatTime(new Date()),
          type: "text",
        };
        saveToHistory(aiResponse);
      }
    } else {
      handleError(new Error("AI服务响应异常"));
    }
  } catch (error) {
    handleError(error);
  } finally {
    isProcessing.value = false;
  }
};

const clickRecord = (item) => {
  if (isProcessing.value) return; // 如果正在处理消息，直接返回
  message.value = item;
  sendMessage();
};

// 修改保存历史记录的函数
const saveToHistory = (message) => {
  try {
    if (!Array.isArray(chatRecords.value)) {
      chatRecords.value = [];
    }

    const currentTime = new Date();

    if (message.isUser && chatHistory.value.length <= 2) {
      const newChat = {
        id: currentTime.getTime().toString(),
        title: truncateText(message.text, 15),
        messages: [...chatHistory.value],
        timestamp: currentTime.getTime(), // 使用时间戳
        time: formatTime(currentTime),
      };
      chatRecords.value = [newChat, ...chatRecords.value];
    } else {
      if (chatRecords.value.length > 0) {
        const currentChat = chatRecords.value[0];
        currentChat.messages = [...chatHistory.value];
        currentChat.timestamp = currentTime.getTime(); // 更新时间戳
        currentChat.time = formatTime(currentTime);
      }
    }

    if (chatRecords.value.length > 20) {
      chatRecords.value = chatRecords.value.slice(0, 20);
    }

    localStorage.setItem("chatRecords", JSON.stringify(chatRecords.value));
  } catch (error) {
    console.error("保存历史记录失败:", error);
  }
};

// 修改加载历史记录的函数
const loadChatRecords = () => {
  try {
    const savedRecords = localStorage.getItem("chatRecords");
    if (savedRecords) {
      const parsed = JSON.parse(savedRecords);
      chatRecords.value = Array.isArray(parsed) ? parsed : [];
    } else {
      chatRecords.value = [];
    }
  } catch (error) {
    console.error("加载历史记录失败:", error);
    chatRecords.value = [];
  }
};

// 修改选择历史记录的函数
const selectHistory = (record) => {
  try {
    if (record && Array.isArray(record.messages)) {
      // 清空当前对话并加载选中的历史对话
      chatHistory.value = [...record.messages];
      // 关闭历史记录弹窗
      closeOverlay();
      // 滚动到底部
      scrollToBottom();
    }
  } catch (error) {
    console.error("选择历史记录失败:", error);
    handleError(new Error("加载历史录失败"));
  }
};

// 改进的错误处理函数
const handleError = (error) => {
  console.error("Error:", error);
  const errorMessage = {
    text: error.message || "服务暂时不可用，请稍后重试",
    isUser: false,
    isError: true,
    type: "error",
    timestamp: new Date(),
    time: formatTime(new Date()),
  };

  // 移除loading消息
  if (chatHistory.value[chatHistory.value.length - 1]?.isLoading) {
    chatHistory.value.pop();
  }

  chatHistory.value.push(errorMessage);
  scrollToBottom();
};

// 添加一个本截断的具函数
const truncateText = (text = "", maxLength = 15) => {
  if (!text) return "";
  const str = String(text);
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

// 修改日期处理相关的函数
const isToday = (timestamp) => {
  if (!timestamp) return false;
  const date = new Date(timestamp);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isYesterday = (timestamp) => {
  if (!timestamp) return false;
  const date = new Date(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

const getTodayRecords = () => {
  return chatRecords.value.filter((record) => {
    // 确保 timestamp 存在且有效
    const timestamp = record.timestamp || record.messages?.[0]?.timestamp;
    return timestamp && isToday(timestamp);
  });
};

const getYesterdayRecords = () => {
  return chatRecords.value.filter((record) => {
    // 确保 timestamp 存在且有效
    const timestamp = record.timestamp || record.messages?.[0]?.timestamp;
    return timestamp && isYesterday(timestamp);
  });
};

const getEarlierRecords = () => {
  const groups = {};
  chatRecords.value.forEach((record) => {
    // 确保 timestamp 存在且有效
    const timestamp = record.timestamp || record.messages?.[0]?.timestamp;
    if (!timestamp) return;

    const date = new Date(timestamp);
    if (!isToday(timestamp) && !isYesterday(timestamp)) {
      const dateStr = date.toISOString().split("T")[0];
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(record);
    }
  });

  return Object.entries(groups)
    .map(([date, records]) => ({
      date,
      records,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

// 修改刷新话的函数
const refreshSession = async () => {
  if (isProcessing.value) return;

  try {
    await createNewSession();
    chatHistory.value = [
      {
        text: "我是工单维保系统AI对话助手，有什么我可以帮助你的吗？",
        isUser: false,
        isLoading: false,
      },
    ];
    scrollToBottom();
  } catch (error) {
    console.error("刷新会话失败:", error);
    handleError(error);
  }
};

// 修改 formatMarkdown 函数
const formatMarkdown = (text) => {
  // 处理连续的有序列表
  let listItems = [];
  let inList = false;
  let currentNumber = 1;

  // 先将文本分行处理
  const lines = text.split("\n");
  const processedLines = lines.map((line) => {
    // 检测是否是有序列表项（支持任意数字开头）
    const listMatch = line.match(/^(\d+)\. (.*)$/);
    if (listMatch) {
      if (!inList) {
        inList = true;
        listItems = [];
        currentNumber = parseInt(listMatch[1]); // 使用实际的序号作为起始值
      }
      listItems.push({
        number: currentNumber++,
        content: listMatch[2],
      });
      return null; // 标记此行已处理
    } else if (inList) {
      // 如果不是列表项且之前在处理列表，则输出累积的列表项
      inList = false;
      const listHtml = `<ol start="${listItems[0].number}">${listItems
        .map((item) => `<li>${item.content}</li>`)
        .join("")}</ol>`;
      listItems = [];
      return listHtml + line;
    }
    return line;
  });

  // 处理最后可能残留的列表项
  if (listItems.length > 0) {
    processedLines.push(
      `<ol start="${listItems[0].number}">${listItems
        .map((item) => `<li>${item.content}</li>`)
        .join("")}</ol>`
    );
  }

  // 将处理后的行重新组合
  const processedText = processedLines.filter((line) => line !== null).join("\n");

  return (
    processedText
      // 处理标题
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // 处理无序列表
      .replace(/^\* (.*$)/gim, "<ul><li>$1</li></ul>")
      // 处理数学符号
      .replace(/\\d\((.*?)\)/g, "d($1)")
      .replace(/\\infty/g, "∞")
      // 处理箭头
      .replace(/->/g, "→")
      // 处理粗体和斜体
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      // 处理代码块
      .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
      // 处理行内代码
      .replace(/`(.*?)`/gim, "<code>$1</code>")
      // 处理换行
      .replace(/\n/gim, "<br>")
  );
};

// 修改 typewriterEffect 函数，实现匀速打字效果
const typewriterEffect = (text, callback) => {
  let index = 0;
  const TYPING_SPEED = 50; // 固定的打字速度，每个字符 50ms

  const type = () => {
    if (index < text.length) {
      callback(text.slice(0, index + 1));
      index++;
      setTimeout(type, TYPING_SPEED);
    }
  };

  type();
};
</script>
<template>
  <div class="frame">
    <div class="overlay" v-if="isoverlay"></div>
    <div class="popup" v-if="ispopup" :class="{ 'popup-leave': popupLeave }">
      <div class="popup-header">
        <div>历史记录</div>
        <img
          src="../static/gray_arrow.svg"
          class="close-icon"
          @click="closeOverlay()"
          style="width: 16rem; height: 26.78rem"
        />
      </div>
      <div class="history-container">
        <!-- 今天 -->
        <div class="date-group">
          <div class="date-header">今天</div>
          <div
            v-for="record in getTodayRecords()"
            :key="record.id"
            class="history-item"
            @click="selectHistory(record)"
          >
            <div class="history-content">
              <img src="../static/record_message.svg" class="message-icon" />
              <div class="history-title">{{ record.title }}</div>
            </div>
            <div class="message-time">{{ record.time }}</div>
          </div>
        </div>
        <!-- 昨天 -->
        <div class="date-group">
          <div class="date-header">昨天</div>
          <div
            v-for="record in getYesterdayRecords()"
            :key="record.id"
            class="history-item"
            @click="selectHistory(record)"
          >
            <div class="history-content">
              <img src="../static/record_message.svg" class="message-icon" />
              <div class="history-title">{{ record.title }}</div>
            </div>
            <div class="message-time">{{ record.time }}</div>
          </div>
        </div>

        <!-- 更早 -->
        <div class="date-group" v-for="group in getEarlierRecords()" :key="group.date">
          <div class="date-header">{{ group.date }}</div>
          <div
            v-for="record in group.records"
            :key="record.id"
            class="history-item"
            @click="selectHistory(record)"
          >
            <div class="history-content">
              <img src="../static/record_message.svg" class="message-icon" />
              <div class="history-title">{{ record.title }}</div>
            </div>
            <div class="message-time">{{ record.time }}</div>
          </div>
        </div>
      </div>
    </div>
    <div
      style="
        width: 100%;
        height: 96rem;
        background: rgba(255, 255, 255, 1);
        padding: 10rem 24rem;
        display: flex;
        align-items: center;
      "
    >
      <img
        src="../static/arrowleft.svg"
        style="width: 16rem; height: 26.78rem; margin-right: 256rem; margin-left: 16rem"
        @click="router.back()"
      />
      <div style="font-size: 32rem; font-weight: 700; margin-right: 158rem">智慧运维</div>
      <img
        src="../static/record.svg"
        style="width: 38rem; height: 34rem; margin-right: 38rem; cursor: pointer"
        :style="{ opacity: isProcessing ? '0.5' : '1' }"
        @click="refreshSession"
      />
      <img
        src="../static/menu.svg"
        style="width: 48rem; height: 48rem"
        @click="openPopup"
      />
    </div>
    <div class="real-chat-container" ref="chatContainerRef">
      <div
        v-for="(item, index) in chatHistory"
        :key="index"
        :class="{
          'user-message-container': item.isUser,
          'ai-message-container': !item.isUser,
        }"
      >
        <div
          :class="{ 'user-message': item.isUser, 'ai-message': !item.isUser }"
          v-if="item.isUser"
        >
          {{ item.text }}
        </div>
        <div
          :class="{ 'user-message': item.isUser, 'ai-message': !item.isUser }"
          v-else
          v-html="formatMarkdown(item.text)"
        ></div>
        <div v-if="item.isLoading" class="loader-16"></div>
      </div>
    </div>
    <div class="chat-container">
      <div class="chat-label">
        <div @click="clickRecord('校园网连不上')">校园网连不上</div>
        <div @click="clickRecord('电脑坏了')">电脑坏了</div>
      </div>
      <div
        style="
          display: flex;
          gap: 32rem;
          align-items: center;
          justify-content: center;
          margin-bottom: 24rem;
        "
      >
        <img src="../static/upload.svg" style="width: 48rem; height: 48rem" />
        <input
          type="text"
          v-model="message"
          :disabled="isProcessing"
          :style="{
            width: '486rem',
            height: '80rem',
            border: '4rem solid rgba(65, 65, 65, 1)',
            borderRadius: '16rem',
            padding: '24rem 32rem',
            opacity: isProcessing ? 0.7 : 1,
          }"
          placeholder="请入你的问题或需求"
          @keyup.enter="sendMessage()"
        />
        <div
          :style="{
            width: '104rem',
            height: '64rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(19, 86, 235, 1)',
            borderRadius: '16rem',
            color: '#ffffff',
            fontSize: '24rem',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.7 : 1,
          }"
          @click="sendMessage()"
        >
          {{ isProcessing ? "处理中..." : "发送" }}
        </div>
      </div>
      <div style="font-size: 20rem; text-align: center">
        以上内容均由AI生成，仅供参考和借鉴
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame {
  width: 100%;
  min-height: calc(100vh - 176rem);
  height: calc(100vh - 176rem);
  background-color: #f3f3f3;
}
.chat-container {
  position: fixed;
  bottom: 0;
  left: 0;
  min-height: 176rem;
  width: 100%;
  background-color: #ffffff;
  border-top: 1px solid #d9d9d9;
  padding: 24rem 16rem;
}
input::placeholder {
  color: rgba(91, 91, 91, 1);
}
.chat-label {
  position: absolute;
  top: -80rem;
  left: 0;
  width: 100%;
  height: 80rem;
  padding: 0 24rem 16rem 24rem;
  display: flex;
  gap: 16rem;
}
.chat-label > div {
  border-radius: 32rem;
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rem;
  color: rgba(65, 65, 65, 1);
  padding: 16rem 24rem;
  user-select: none;
  cursor: pointer;
}
.real-chat-container {
  padding-top: 20rem;
  width: 100%;
  height: calc(100vh - 376rem);
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
.ai-message-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 36rem;
}
.user-message-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 36rem;
}
.user-message {
  background-color: #e6f7ff;
  padding: 16rem 24rem;
  margin-bottom: 16rem;
  border-radius: 16rem;
  max-width: 80%;
  color: #313131;
  text-align: left;
  font-size: 32rem;
}
.ai-message {
  background-color: #ffffff;
  padding: 16rem 24rem;
  margin-bottom: 16rem;
  border-radius: 16rem;
  text-align: left;
  color: #313131;
  max-width: 80%;
  display: inline-block;
  transition: all 0.3s ease-out;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  line-height: 1.6;
}

/* 添加 Markdown 元素样式 */
:deep(h1) {
  font-size: 36rem;
  margin: 16rem 0;
  font-weight: bold;
}

:deep(h2) {
  font-size: 32rem;
  margin: 14rem 0;
  font-weight: bold;
}

:deep(h3) {
  font-size: 28rem;
  margin: 12rem 0;
  font-weight: bold;
}

:deep(ul),
:deep(ol) {
  padding-left: 24rem;
  margin: 8rem 0;
}

:deep(li) {
  margin: 4rem 0;
}

:deep(code) {
  background-color: #f5f5f5;
  padding: 2rem 6rem;
  border-radius: 4rem;
  font-family: monospace;
}

:deep(pre) {
  background-color: #f5f5f5;
  padding: 16rem;
  border-radius: 8rem;
  overflow-x: auto;
  margin: 12rem 0;
}

:deep(strong) {
  font-weight: bold;
}

:deep(em) {
  font-style: italic;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader-16 {
  position: relative;
  width: 24rem;
  height: 24rem;
  margin-left: 12rem;
  display: inline-block;
  border-radius: 50%;
  background-image: linear-gradient(0deg, rgba(14, 13, 13, 0.2) 33%, #0e0f0e 100%);
  animation: rotation 1s linear infinite;
}

.loader-16:after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20rem;
  height: 20rem;
  border-radius: 50%;
  background-color: #f3f3f3;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 999;
  animation: fadein 0.3s ease-out forwards;
}
.popup {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 90%; /* 改为90%宽度，留出缝隙 */
  background: #fff;
  z-index: 1000;
  padding: 0;
  transform: translateX(100%); /* 初始位置在屏幕右侧 */
  animation: slidein 0.3s ease-out forwards;
}
.popup-leave {
  animation: slideout 0.3s ease-in forwards;
}
@keyframes slidein {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes slideout {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
.popup-header {
  height: 88rem;
  padding: 0 32rem;
  display: flex;
  justify-content: space-between; /* 改为两端对齐 */
  align-items: center;
  position: relative;
  border-bottom: 1px solid #f0f0f0;
}

.popup-header > div {
  font-size: 34rem;
  font-weight: 500;
  color: #000;
}

.close-icon {
  width: 48rem;
  height: 48rem;
  cursor: pointer;
  position: static; /* 移除绝对定位 */
  left: auto; /* 移除左侧定位 */
}

.history-container {
  height: calc(100vh - 88rem);
  overflow-y: auto;
  padding: 24rem 32rem;
  background: #f5f5f5;
}

/* 添加日期分组样式 */
.date-group {
  margin-bottom: 32rem;
}

.date-header {
  font-size: 28rem;
  color: #999;
  margin-bottom: 16rem;
  padding: 0 16rem;
  font-weight: 500;
}

.history-item {
  padding: 24rem 32rem;
  background: #fff;
  border-radius: 12rem; /* 增加圆角 */
  cursor: pointer;
  margin-bottom: 16rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 96rem;
  transition: all 0.2s ease; /* 添加过渡效果 */
}

.history-item:hover {
  background-color: #f8f8f8;
  transform: translateX(4rem); /* 添加悬停时的位移效果 */
}

.history-item:active {
  transform: scale(0.98); /* 添加点击效果 */
}

.history-content {
  display: flex;
  align-items: center;
  gap: 16rem;
}

.message-icon {
  width: 36rem;
  height: 36rem;
  opacity: 0.7;
}

.history-title {
  font-size: 28rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 460rem; /* 调整最大宽度 */
  font-weight: 400;
}

.message-time {
  font-size: 26rem;
  color: #999;
  min-width: 100rem; /* 固定时间宽度 */
  text-align: right;
}

/* 添加滚动条样式 */
.history-container::-webkit-scrollbar {
  width: 6rem;
}

.history-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3rem;
}

.history-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3rem;
}

.history-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.error-message {
  background-color: #fff2f0;
  color: #ff4d4f;
  padding: 16rem 24rem;
  margin-bottom: 16rem;
  border-radius: 16rem;
  max-width: 80%;
}

.typing {
  display: inline-block;
  width: 20rem;
  height: 20rem;
  margin-left: 8rem;
  background: #1890ff;
  border-radius: 50%;
  animation: typing 1s infinite;
}

@keyframes typing {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

.message-container {
  display: flex;
  flex-direction: column;
  gap: 8rem;
}

.message-time {
  font-size: 20rem;
  color: #999;
  margin: 4rem 0;
}

/* 添加数学符号相关样式 */
.ai-message code {
  font-family: "Courier New", Courier, monospace;
  background-color: #f5f5f5;
  padding: 2rem 4rem;
  border-radius: 4rem;
}

.ai-message ol {
  padding-left: 32rem;
  margin: 16rem 0;
}

.ai-message ol li {
  margin: 8rem 0;
}
</style>
