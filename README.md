# 屿藏 · 原画收藏馆

原创动漫原画展示 H5。精细线稿、鲜明赛璐璐色彩与动态人物，配合简洁画册式排版。适配手机和桌面，人民币标价。

## 开发

要求 Node.js 20.19+ 或 22.12+，当前环境使用 Node.js 24。

```sh
npm ci
npm run dev
```

云环境使用 `export npm_config_cache=/workspace/.cache/npm` 指定可写缓存。

```sh
npm run build
npm run preview
```

四个入口为「首页、市场、活动、我的」。支持作品轮播、市场分类与价格排序、搜索、详情、演示收藏确认、本机昵称及收藏画册。常见手机尺寸为一屏布局，短屏通过减少次要文案保持主要信息与操作可见，不缩小成微型文字。

## 作品与限制

四幅图像为原创生成的当代动漫风格人物和场景，不对应已有动漫角色，不代表任何既有动漫 IP 授权。示例作者、价格和发行量均为演示数据。当前没有真实登录、支付、订单、投稿或链上确权。

`yu-saved` 与 `yu-profile-name` 使用 localStorage，保留原有本机收藏ID及昵称；新画风更新了这些演示作品的名称与图片。当前不支持跨设备同步，清除浏览器数据会移除收藏。

作品图片位于 `public/art/`，无外部图片或字体服务依赖。
旧版样式、页面和潮玩图片保留在 `design-history/`；本轮需求与设计方向见 `brand-spec.md` 和 `direction-approved.md`。

## 发布

源码在 `main`，GitHub Pages 使用 `gh-pages` 根目录。仓库路径为 `/lukas/`。

```sh
npm run build -- --base=/lukas/
```

将 `dist` 内文件更新到 `gh-pages`，保留 `.nojekyll`。开发服务器和预览服务器是内部验证服务，不等同于公网部署。
