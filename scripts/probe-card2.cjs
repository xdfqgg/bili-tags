// Step 3 侦察脚本 3：滚动推荐流触发懒加载后，抓真实卡片结构
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.bilibili.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);

  // 滚动几次，触发懒加载渲染
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(2500);
  }

  const info = await page.evaluate(() => {
    const out = { scrollY: window.scrollY };

    // 1) 有真实内容的 bili-video-card（非骨架）
    const realCards = [...document.querySelectorAll('.bili-video-card')].filter(
      (c) => !c.querySelector('.bili-video-card__skeleton')
    );
    out.realCardCount = realCards.length;

    // 2) .feed-card 结构
    const feedCards = document.querySelectorAll('.feed-card');
    out.feedCardCount = feedCards.length;
    if (feedCards.length > 0) {
      out.feedCardClasses = feedCards[0].className;
      out.feedCardHTML = feedCards[0].outerHTML.slice(0, 3500);
    }

    // 3) 真实卡片内部结构探针
    if (realCards.length > 0) {
      const card = realCards[0];
      const innerSels = [
        '.bili-video-card__cover',
        '.bili-video-card__info',
        '.bili-video-card__title',
        '.bili-video-card__stats',
        '.bili-video-card__info--author',
        '.bili-video-card__duration',
        '.bili-video-card__image',
        'a[href*="/video/BV"]',
        'img',
        'picture',
      ];
      out.innerCounts = {};
      for (const sel of innerSels) {
        out.innerCounts[sel] = card.querySelectorAll(sel).length;
      }
      const link = card.querySelector('a[href*="/video/BV"]');
      out.href = link ? link.href : null;
      const title = card.querySelector('[class*="title"]');
      out.titleText = title ? title.textContent.trim().slice(0, 80) : null;
      const img = card.querySelector('img');
      out.imgSrc = img ? (img.src || '').slice(0, 150) : null;
      out.templateHTML = card.outerHTML.slice(0, 3500);
    }
    return out;
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch((e) => {
  console.error('PROBE_ERR:', e.message);
  process.exit(1);
});
