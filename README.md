# 工单维保系统

### 简介
**此项目为腾讯mini项目10接口自动化与基于大模型的UI自动化考题解答**

工单维保系统是一个专为学校企业设备管理和维护设计的系统，旨在简化故障报修、维保计划和工单跟踪流程。系统支持多用户协作，适用于工厂、物业管理、IT运维等场景。

### 功能
**工单管理**：创建、分配和跟踪工单状态。

**设备档案**：记录设备信息、维护历史和故障记录。

**计划性维护**：支持周期性维保任务调度。

**实时通知**：通过邮件或消息通知工单更新。

**报表分析**：生成维保统计和故障分析报告。

**多平台支持**：提供Web和移动端访问。

### 快速开始

1. 克隆仓库：
   ```bash
   git clone https://github.com/burial-666/OrderMaintenance-monorepo-mini.git
   ```
2. 安装依赖：
   ```bash
   cd OrderMaintenance-monorepo-mini
   pnpm install
   ```
3. 启动服务：
   ```bash
   pnpm run dev:all
   ```

#### 使用
已部署网址：https://sztuwork.sligenai.cn/login/login

登录账号如下：

测试用户1  12345678911。

测试教师 12345678918。

测试工程师1 12345678912。(学生机房运维)

测试工程师2 12345678913。(学生机房运维)

测试工程师3 12345678914。(系统运维)

测试组长1 12345678915。(学生机房运维)

测试组长2 12345678916。(系统运维)

测试信息中心 12345678917

信息中心登录网址：https://sztuwork.sligenai.cn/center/login

测试统一使用验证码202410

**在生产环境使用**

**用户(学生/教师) 工程师 组长端**使用`https://sztuwork.sligenai.cn/login/login`登录

**推荐通过手机登录**

![bff4ceb9b1e6ec9d27b354ea10a140c](https://github.com/user-attachments/assets/6ccb26fc-7137-4efa-9017-fd67c5c3ce98)

**亦可在电脑端使用f12模拟手机登录**

![image](https://github.com/user-attachments/assets/d997350c-a648-44b7-84ed-2d5145ef3c4b)

**信息中心端**使用`https://sztuwork.sligenai.cn/center/login`登录

![image](https://github.com/user-attachments/assets/8f4893f7-2127-470a-a50c-51c4c9ed3b1a)

**在开发环境使用**

**需要在`http://localhost:8104/login`中登录后拿到token后复制到各个端**
![image](https://github.com/user-attachments/assets/cc6460e1-9954-4a00-b1c1-8ad13ee0c9d0)

**例如将token给到用户端**
![image](https://github.com/user-attachments/assets/e2b7210c-5f70-4a6c-9213-63b6a037c8ad)
**最后将网址改为/school**
![image](https://github.com/user-attachments/assets/a7a2a32c-f975-4351-a286-fff81021d5bf)

**工程师端和组长端同理**

工程师端改为/engineer

组长端改为/group

## 功能使用

**在用户端创建工单**

![image](https://github.com/user-attachments/assets/8349120b-abc4-4756-b446-fee115bcbe2a)

**填写故障信息**

![image](https://github.com/user-attachments/assets/b5ff17f6-cad7-45aa-ba67-1ed0d05ec075)

**组长端拿到工单**

![image](https://github.com/user-attachments/assets/fe695d8c-cde1-43b0-bd7e-79b8a487d2b7)

**组长可以选择分配给租内工程师或者自己接单亦或是工单分配的组别错误可以进行转组**

![image](https://github.com/user-attachments/assets/3d6c6c39-a215-4d11-84e7-22c56e42d491)

**这里演示选择分配给组员**

![image](https://github.com/user-attachments/assets/2edd3748-0829-4e57-a3de-bb26ea119bdf)

**组员拿到分配的工单**

![image](https://github.com/user-attachments/assets/d632f37b-93dd-48c6-a29a-7151d5f123ad)

**并且进行接单**

![image](https://github.com/user-attachments/assets/ab45c0f3-8f8e-439b-8a1a-08db65db3936)

**接单后要完成到达打卡**

![image](https://github.com/user-attachments/assets/484ea58e-f3b1-44ff-9f2c-73d680d4b635)

**到达后若完成可以选择完成，若无法完成可以选择挂单**

![image](https://github.com/user-attachments/assets/4423f4fa-3393-4ce2-9d63-1a17591da237)

**完成后项目会结束**

![image](https://github.com/user-attachments/assets/7ee1b806-f3de-43a9-a686-9456d7aa5600)

**若选择挂单，任务可以完成可以结束挂单，若无法完成可以退回挂单**

![image](https://github.com/user-attachments/assets/c781d670-e212-439a-8d87-a70a8139ea04)

##  数据分析与统计

**工程师可以看到自己的工作数据并且可以进行上下班打卡以及工单的创建**

![image](https://github.com/user-attachments/assets/3d852124-0db1-481c-a42f-0e1ec5459579)

**组长可以看到自己的数据已经组员的数据与当前工作情况**

![image](https://github.com/user-attachments/assets/52f1ae7e-17cd-4149-91ac-1560a1f02378)

**组长同时可以对组员进行请假审批以及管理用户创建工单时选择的问题以及创建工单**

![image](https://github.com/user-attachments/assets/3c9694bb-5831-4f9d-a56f-88be9a0ded1c)

