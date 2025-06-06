(function() {
    function setRem() {
      // 获取页面宽度
      var width = window.innerWidth;
      // 设计稿的宽度（可以根据实际设计稿调整）
      var designWidth = 750; // 比如设计稿是 750px 宽
  
      // 设定 1 rem 等于 1 rpx (你可以根据需要调整比例)
      var rem = width / designWidth;
  
      // 设置根元素字体大小
      document.documentElement.style.fontSize = rem + 'px';
    }
  
    // 初始化设置
    setRem();
  
    // 监听窗口大小变化，动态调整
    window.addEventListener('resize', setRem);
  })();