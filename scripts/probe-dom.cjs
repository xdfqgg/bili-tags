// Step 3 侦察脚本：用 Edge（channel: msedge）无头打开 B 站首页，探测视频卡片结构
// 用法：npm exec -y --package=playwright -- node scripts/probe-dom.cjs
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.bilibili.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  // 等推荐流渲染出来
  await page.waitForTimeout(10000);

  const info = await page.evaluate(() => {
    const selectors = [
      '.bili-video-card',
      '.feed-card',
      '.bili-video-card__wrap',
      '.video-card',
      '.bili-grid > *',
    ];
    const out = { url: location.href, title: document.title };
    for (const sel of selectors) {
      out[`count:${sel}`] = document.querySelectorAll(sel).length;
    }
    const bvLinks = document.querySelectorAll('a[href*="/video/BV"]');
    out.bvLinkCount = bvLinks.length;
    if (bvLinks.length > 0) {
      const first = bvLinks[0];
      out.sampleHref = first.href;
      const card =
        first.closest('.bili-video-card') ||
        first.closest('[class*="card"]') ||
        first.parentElement;
      out.sampleCardClass = card ? card.className : null;
      out.sampleCardHTML = card ? card.outerHTML.slice(0, 2500) : null;
    }
    // 找推荐流的容器（注入锚点候选）
    const feedCandidates = ['.feed2', '.feed-card', '.recommended-container_floor-aside', '.container.is-version8'];
    out.feedContainers = {};
    for (const sel of feedCandidates) {
      out.feedContainers[sel] = document.querySelectorAll(sel).length;
    }
    return out;
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch((e) => {
  console.error('PROBE_ERR:', e.message);
  process.exit(1);
});
