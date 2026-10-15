# 屿藏 · YU COLLECT

简洁现代的数字藏品展示原型，适配手机与桌面，人民币标价。

## 开发

要求 Node.js 20.19+ 或 22.12+（当前环境 Node.js 24）。

```sh
npm ci
npm run dev
```

云环境中使用 `export npm_config_cache=/workspace/.cache/npm` 指定可写缓存目录。

```sh
npm run build
npm run preview
```

首页支持分类、搜索与收藏；藏品详情支持数量选择与收藏确认。收藏使用 localStorage 保存在当前浏览器。通过 URL hash 切换页面，无需服务端路由规则。

作品由本地 CSS 抽象图形呈现，不依赖外部图片。字体可选加载 Google Fonts，无法访问时使用系统字体。

所有藏品、作者和发行数据为演示内容；不包含登录、支付、订单或区块链服务。购买入口只展示演示确认，不会扣款。订阅入口未接入邮件服务。
