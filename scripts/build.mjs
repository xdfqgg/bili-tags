// 构建脚本：把 TypeScript 源码编译打包进 dist/，并复制静态文件。
// dist/ 就是最终在 Edge 里「加载解压缩的扩展」时选择的文件夹。
import { build } from 'esbuild';
import { cpSync, mkdirSync, rmSync } from 'node:fs';

// 先清空旧产物再重建，防止改名/删除的源码在 dist 里留下「幽灵文件」
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });

await build({
  entryPoints: ['src/content_script.ts', 'src/background.ts', 'src/options.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'iife', // 浏览器传统脚本格式；background 以 module 加载同样兼容
  target: 'chrome120', // Edge 120+ 对应 Chromium 120+
  logLevel: 'info',
});

// 复制扩展运行时需要的静态文件
cpSync('manifest.json', 'dist/manifest.json');
cpSync('src/options.html', 'dist/options.html');
cpSync('src/styles.css', 'dist/styles.css');

console.log('✅ 构建完成 → dist/');
