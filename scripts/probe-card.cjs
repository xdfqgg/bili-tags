// Step 3 侦察脚本 2：深挖 .bili-video-card 卡片内部结构（克隆模板用）
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.bilibili.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(10000);

  const info = await page.evaluate(() => {
    const feed = document.querySelector('.feed2');
    const cards = feed ? feed.querySelectorAll('.bili-video-card') : document.querySelectorAll('.bili-video-card');
    const out = { totalInFeed: cards.length };
    if (cards.length === 0) return out;

    const card = cards[0];
    out.cardClasses = card.className;

    // 内部结构探针：每个子选择器在卡片里出现几个
    const innerSels = [
      '.bili-video-card__cover',      // 封面容器?
      '.bili-video-card__image',      // 封面图?
      '.bili-video-card__info',       // 信息区?
      '.bili-video-card__title',      // 标题?
      '.bili-video-card__stats',      // 播放/弹幕统计?
      '.bili-video-card__info--author', // 作者?
      '.bili-video-card__duration',   // 时长?
      'picture', 'img', 'a[href*="/video/BV"]',
    ];
    out.innerCounts = {};
    for (const sel of innerSels) {
      out.innerCounts[sel] = card.querySelectorAll(sel).length;
    }

    // 关键信息提取
    const link = card.querySelector('a[href*="/video/BV"]');
    out.href = link ? link.href : null;
    const title = card.querySelector('.bili-video-card__title, [class*="title"]');
    out.titleText = title ? title.textContent.trim().slice(0, 60) : null;
    const img = card.querySelector('img');
    out.imgSrc = img ? img.src.slice(0, 120) : null;
    out.imgAlt = img ? img.alt.slice(0, 60) : null;

    // 卡片在 feed 里的位置关系（注入时插在哪）
    out.parentOfCard = card.parentElement ? card.parentElement.className : null;
    out.cardTag = card.tagName;

    // 截取卡片 HTML 作为克隆模板（保留结构）
    out.templateHTML = card.outerHTML.slice(0, 3000);
    return out;
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch((e) => {
  console.error('PROBE_ERR:', e.message);
  process.exit(1);
});
