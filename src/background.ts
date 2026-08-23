// background（后台 service worker）：扩展的「后台办公室」，
// 负责与 B 站 API 通信、管理缓存（功能在 Step 7 实现）。
// 骨架阶段只打印一行日志，证明 service worker 能启动。
console.log('[bili-tags] background service worker 已启动');

// MV3 的 service worker 空闲时会被浏览器回收（省内存）。
// 挂一个安装事件监听，让它在启动后至少活着完成一次事件处理。
chrome.runtime.onInstalled.addListener(() => {
  console.log('[bili-tags] 扩展已安装/更新');
});
