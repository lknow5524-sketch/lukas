import './style.css';

// One approved direction: original contemporary anime characters and precise cel shading.
// Existing saved IDs and nicknames stay local. No real payment, orders or chain assets.
const works = [
  { id: '01', name: '潮汐信使', en: 'TIDE MESSENGER', artist: '屿藏绘画室', category: '奇境冒险', price: 299, edition: 500, image: 'tide', desc: '踏着涌浪送信的少年，带着三尾纸鱼与一身海风，把消息送往世界的另一边。' },
  { id: '02', name: '镜夜行者', en: 'MIRROR WALKER', artist: '屿藏绘画室', category: '都市幻想', price: 199, edition: 800, image: 'mirror', desc: '她轻轻打了一个响指，镜中的乌鸦便飞进现实。今夜，所有倒影都有了自己的故事。' },
  { id: '03', name: '晴空猎手', en: 'SKY CHASER', artist: '屿藏绘画室', category: '奇境冒险', price: 399, edition: 300, image: 'kite', desc: '把机械龙鸢放进风里，再把自己交给天空。那道金色的身影，永远追着下一场日出。' },
  { id: '04', name: '焰羽乐师', en: 'EMBER MELODY', artist: '屿藏绘画室', category: '都市幻想', price: 259, edition: 600, image: 'ember', desc: '琴弦一响，火羽就漫过夜空。她用一段旋律，把整座城市唤进热烈的梦境。' },
];
const categories = ['全部', '奇境冒险', '都市幻想'];
let saved = new Set(), selectedId = '02', category = '全部', query = '', sort = 'featured', pageIndex = 0, eventFilter = '全部';
try {
  const value = JSON.parse(localStorage.getItem('yu-saved') || '[]');
  if (Array.isArray(value)) saved = new Set(value.filter(id => works.some(w => w.id === id)));
} catch { /* Browsing remains available without local storage. */ }
const app = document.querySelector('#app');
const money = n => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(n);
const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const paths = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
  market: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  events: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 11h16m-12 5h3m3 0h2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  heart: '<path d="M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 0 0-7 7l8 8 8-8a5 5 0 0 0 0-7Z"/>',
  right: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  left: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v7m0-11v1"/>',
  order: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8m-8 4h8m-8 4h4"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || paths.info}</svg>`;
const picture = (work, cls = '') => `<img class="art-image ${cls}" src="${import.meta.env.BASE_URL}art/${work.image}.webp" alt="原创赛璐璐插画：${work.name}" draggable="false">`;
function state() {
  const path = location.hash.slice(1) || '/';
  return { path, market: path === '/market', events: path === '/events', profile: path === '/me', collection: path === '/collection', detail: path.startsWith('/item/'), id: path.split('/')[2] };
}
function filtered(collection = false) {
  let list = works.filter(w => (!collection || saved.has(w.id)) && (category === '全部' || w.category === category) && (!query || `${w.name}${w.artist}`.toLowerCase().includes(query.toLowerCase())));
  if (sort !== 'featured') list = [...list].sort((a, b) => sort === 'price-up' ? a.price - b.price : b.price - a.price);
  return list;
}
function header() {
  return `<header class="site-header"><a class="brand" href="#/" aria-label="屿藏首页">屿藏<span>原画收藏馆</span></a><span class="header-caption">一帧画，一个未完的故事。</span><div class="header-actions"><button class="icon-button" data-action="search" aria-label="搜索藏品">${icon('search')}</button><button class="icon-button" data-action="about" aria-label="关于屿藏">${icon('info')}</button></div></header>`;
}
function nav() {
  const s = state();
  const current = s.market || s.detail ? 'market' : s.events ? 'events' : s.profile || s.collection ? 'me' : 'home';
  return `<nav class="bottom-nav" aria-label="主导航">${[['home', '/', '首页'], ['market', '/market', '市场'], ['events', '/events', '活动'], ['me', '/me', '我的']].map(([id, path, text]) => `<a href="#${path}" ${id === current ? 'aria-current="page"' : ''}>${icon(id === 'me' ? 'user' : id)}<span>${text}</span></a>`).join('')}</nav>`;
}
const note = () => '<p class="page-note">原创插画展示 · 暂无真实交易</p>';
const heading = (title, subtitle, side = '') => `<div class="page-heading"><div><p class="eyebrow">${subtitle}</p><h1>${title}</h1></div>${side}</div>`;
const saveButton = w => `<button class="save-button ${saved.has(w.id) ? 'selected' : ''}" data-save="${w.id}" aria-label="${saved.has(w.id) ? '取消收藏' : '收藏'}${w.name}" aria-pressed="${saved.has(w.id)}">${icon('heart')}</button>`;
function card(w) {
  return `<article class="art-card"><button class="card-picture" data-open="${w.id}" aria-label="查看${w.name}">${picture(w)}<span class="card-category">${w.category}</span></button>${saveButton(w)}<div class="card-copy"><button class="card-title" data-open="${w.id}"><h2>${w.name}</h2></button><div class="card-price"><strong>${money(w.price)}</strong><span>${w.edition} 份</span></div></div></article>`;
}
function home() {
  const w = works.find(w => w.id === selectedId) || works[0];
  return `<main class="home-page">${heading('把故事，留在这一帧。', '本期原画 · 幻境来信', '<span class="issue">卷 / 01</span>')}<section class="home-layout"><div class="feature-picture">${picture(w)}<span class="frame-label">原画 ${w.id} / 04</span><div class="feature-pager"><button class="icon-button" data-step="-1" aria-label="上一件藏品">${icon('left')}</button><div class="pager-dots">${works.map(x => `<button data-select="${x.id}" class="${x.id === w.id ? 'active' : ''}" aria-label="查看${x.name}" aria-pressed="${x.id === w.id}"><span></span></button>`).join('')}</div><button class="icon-button" data-step="1" aria-label="下一件藏品">${icon('right')}</button></div></div><div class="feature-copy"><div class="work-kicker"><span>${w.category} / 原创系列</span>${saveButton(w)}</div><h2>${w.name}</h2><p class="work-description">${w.desc}</p><div class="author-line"><span>${w.artist}</span><span>限量 ${w.edition} 份</span></div><div class="purchase-line"><div><small>发行价格 · 人民币</small><strong>${money(w.price)}</strong></div><button class="primary" data-open="${w.id}">查看原画 ${icon('right')}</button></div><a class="text-link" href="#/market">翻阅全部藏品 ${icon('chevron')}</a></div></section>${note()}</main>`;
}
function market(collection = false) {
  const list = filtered(collection);
  return `<main class="market-page">${heading(collection ? '我的收藏画册' : '每一帧，都值得珍藏。', collection ? '喜欢的故事，在这里重逢' : '原画市场 · 人民币标价', `<span class="count">${list.length} 件作品</span>`)}<div class="market-toolbar"><div class="filters" role="group" aria-label="藏品分类">${categories.map(c => `<button data-category="${c}" class="${category === c ? 'active' : ''}" aria-pressed="${category === c}">${c}</button>`).join('')}</div><label class="sort-label"><span class="sr-only">藏品排序</span><select aria-label="藏品排序"><option value="featured" ${sort === 'featured' ? 'selected' : ''}>精选</option><option value="price-up" ${sort === 'price-up' ? 'selected' : ''}>价格升序</option><option value="price-down" ${sort === 'price-down' ? 'selected' : ''}>价格降序</option></select></label></div><section class="market-grid" aria-label="藏品列表">${list.length ? list.map(card).join('') : `<div class="empty"><h2>${collection ? '画册还空着' : '没有找到作品'}</h2><p>${collection ? '在作品上轻点爱心，开始你的收藏。' : '换个关键词或分类试试。'}</p><button class="primary" data-action="reset">${collection ? '去看原画' : '重置筛选'} ${icon('right')}</button></div>`}</section>${note()}</main>`;
}
function events() {
  const list = [
    { id: 'season', type: '作品专题', tag: '本期画册', title: '幻境来信 · 第一卷', desc: '潮汐、镜夜与火羽。四个角色，四场奇境冒险。', work: works[0], action: '翻开画册' },
    { id: 'creator', type: '创作计划', tag: '创作手记', title: '线条之间，故事发生', desc: '从一根线，到一场未完的梦。认识赛璐璐画风。', work: works[3], action: '阅读手记' },
  ].filter(e => eventFilter === '全部' || eventFilter === e.type);
  return `<main class="events-page">${heading('故事之外，还有故事。', '画册与创作专题')}<div class="filters" role="group" aria-label="活动分类">${['全部', '作品专题', '创作计划'].map(c => `<button class="${eventFilter === c ? 'active' : ''}" data-event-filter="${c}" aria-pressed="${eventFilter === c}">${c}</button>`).join('')}</div><section class="event-grid">${list.map(e => `<article class="event-card"><div class="event-image">${picture(e.work)}</div><div class="event-copy"><span class="event-tag">${e.tag}</span><h2>${e.title}</h2><p>${e.desc}</p><button class="text-link" data-event="${e.id}">${e.action} ${icon('right')}</button></div></article>`).join('')}</section><p class="page-note">专题演示 · 暂无报名与真实发售</p></main>`;
}
function nickname() { try { return localStorage.getItem('yu-profile-name') || '故事收藏者'; } catch { return '故事收藏者'; } }
function profile() {
  const list = works.filter(w => saved.has(w.id));
  pageIndex = Math.max(0, Math.min(pageIndex, Math.ceil(list.length / 2) - 1));
  const shown = list.slice(pageIndex * 2, pageIndex * 2 + 2);
  return `<main class="profile-page"><section class="profile-sheet"><div class="profile-person"><span class="profile-avatar"><img src="${import.meta.env.BASE_URL}art/mirror.webp" alt="原画人物头像"></span><div><p class="eyebrow">属于你的故事集</p><h1>${escape(nickname())}</h1></div><button class="icon-button" data-action="edit-profile" aria-label="编辑昵称">${icon('chevron')}</button></div><div class="profile-stats"><div><strong>${list.length.toString().padStart(2, '0')}</strong><span>收藏作品</span></div><div><strong>${new Set(list.map(w => w.category)).size.toString().padStart(2, '0')}</strong><span>故事分类</span></div><div><strong>${money(list.reduce((sum, w) => sum + w.price, 0))}</strong><span>参考价 · 非余额</span></div></div></section><section class="profile-tools" aria-label="个人中心功能"><button data-action="orders">${icon('order')}<span>订单</span></button><button data-action="favorites">${icon('heart')}<span>收藏</span></button><button data-action="edit-profile">${icon('user')}<span>资料</span></button><button data-action="help">${icon('info')}<span>帮助</span></button></section><section class="profile-holdings"><div class="section-heading"><h2>我的画册</h2><div class="collection-pager"><button class="icon-button" data-profile-step="-1" aria-label="上一组收藏" ${pageIndex === 0 ? 'disabled' : ''}>${icon('left')}</button><span>${list.length ? pageIndex + 1 : 0} / ${Math.ceil(list.length / 2)}</span><button class="icon-button" data-profile-step="1" aria-label="下一组收藏" ${pageIndex >= Math.ceil(list.length / 2) - 1 ? 'disabled' : ''}>${icon('right')}</button></div></div><div class="saved-grid">${shown.length ? shown.map(card).join('') : '<div class="empty"><h2>留一个位置，给下一次心动。</h2><p>收藏喜欢的原画，让故事在这里继续。</p><a href="#/market" class="primary">去看原画 ' + icon('right') + '</a></div>'}</div></section><p class="page-note">资料与收藏保存在本机 · 未连接真实账户</p></main>`;
}
function detail(id) {
  const w = works.find(w => w.id === id);
  if (!w) { location.hash = '/market'; return ''; }
  selectedId = w.id;
  return `<main class="detail-page"><div class="detail-top"><a href="#/market" class="text-link">${icon('left')} 返回市场</a><button class="text-link" data-action="notes">收藏须知 ${icon('info')}</button></div><section class="detail-layout"><div class="detail-picture">${picture(w)}<span class="frame-label">原画 ${w.id} / 幻境来信</span></div><div class="detail-copy"><div class="work-kicker"><span>${w.category} / 原创插画</span>${saveButton(w)}</div><h1>${w.name}</h1><p class="work-description">${w.desc}</p><div class="author-line"><span>${w.artist}</span><span>限量 ${w.edition} 份</span></div><div class="purchase-line"><div><small>发行价格 · 人民币</small><strong>${money(w.price)}</strong></div><button class="primary" data-action="buy">收藏这一帧 ${icon('right')}</button></div><p class="detail-notice">演示藏品 · 不生成订单，不会扣款</p></div></section>${note()}</main>`;
}
function render() {
  const s = state();
  document.title = `${s.market ? '市场' : s.events ? '活动' : s.profile ? '我的' : s.collection ? '我的收藏' : s.detail ? works.find(w => w.id === s.id)?.name || '原画' : '首页'} · 屿藏`;
  const content = s.market ? market() : s.events ? events() : s.profile ? profile() : s.collection ? market(true) : s.detail ? detail(s.id) : home();
  app.innerHTML = header() + content + nav();
  const select = app.querySelector('select');
  if (select) select.onchange = e => { sort = e.target.value; render(); };
}
function toast(message) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = message;
  document.body.append(el); setTimeout(() => el.remove(), 3000);
}
function persist() { try { localStorage.setItem('yu-saved', JSON.stringify([...saved])); } catch { toast('当前浏览器限制存储，收藏仅在本页保留。'); } }
function modal(content, extra = '') {
  document.querySelector('dialog')?.close();
  const lastFocus = document.activeElement;
  const d = document.createElement('dialog'); d.className = extra;
  d.innerHTML = `<button class="icon-button modal-close" aria-label="关闭">${icon('close')}</button>${content}`;
  const title = d.querySelector('h2'); if (title) { title.id = 'dialog-title'; d.setAttribute('aria-labelledby', title.id); }
  document.body.append(d); d.querySelector('.modal-close').onclick = () => d.close();
  d.addEventListener('click', e => { if (e.target === d) { const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); } });
  d.addEventListener('close', () => { d.remove(); if (lastFocus?.isConnected) lastFocus.focus(); }); d.showModal(); return d;
}
function searchDialog() {
  const d = modal(`<p class="eyebrow">翻阅你的故事</p><h2>寻找一帧心动</h2><label class="search-input">${icon('search')}<input type="search" aria-label="搜索原画或创作者" placeholder="原画名 / 创作者" value="${escape(query)}"></label><div class="search-results"></div>`, 'search-dialog');
  const input = d.querySelector('input');
  const update = () => {
    const list = works.filter(w => `${w.name}${w.artist}`.toLowerCase().includes(input.value.toLowerCase()));
    d.querySelector('.search-results').innerHTML = list.length ? list.map(w => `<button class="search-result" data-result="${w.id}">${picture(w)}<span><strong>${w.name}</strong><small>${money(w.price)}</small></span>${icon('chevron')}</button>`).join('') : '<p class="no-results">没有找到，换个关键词试试。</p>';
  };
  input.oninput = update; update(); input.focus();
  d.addEventListener('click', e => { const el = e.target.closest('[data-result]'); if (el) { d.close(); location.hash = `/item/${el.dataset.result}`; } });
}
function editProfile() {
  const d = modal(`<p class="eyebrow">本机个人资料</p><h2>你的故事，如何署名？</h2><form class="profile-form"><label for="nickname">昵称 · 最多 16 字</label><input id="nickname" maxlength="16" required value="${escape(nickname())}"><button class="primary" type="submit">保存昵称 ${icon('right')}</button></form>`);
  const input = d.querySelector('input'); input.oninput = () => input.setCustomValidity('');
  d.querySelector('form').onsubmit = e => {
    e.preventDefault(); const value = input.value.trim();
    if (!value) { input.setCustomValidity('请输入昵称'); input.reportValidity(); return; }
    try { localStorage.setItem('yu-profile-name', value); } catch { toast('浏览器未允许保存昵称'); return; }
    d.close(); render(); toast('已保存到本机');
  };
}
function buy() {
  const w = works.find(w => w.id === selectedId); let quantity = 1;
  const d = modal(`<p class="eyebrow">收藏这一帧</p><h2>${w.name}</h2><div class="quantity"><span>数量 <small>最多 3 份</small></span><div><button data-quantity="-1" aria-label="减少数量">−</button><output>1</output><button data-quantity="1" aria-label="增加数量">＋</button></div></div><strong class="total">${money(w.price)}</strong><p>当前是展示原型，不会生成订单或扣款。收藏后，可在「我的」中查看。</p><button class="primary confirm">加入我的画册 ${icon('heart')}</button>`);
  const update = () => { d.querySelector('output').textContent = quantity; d.querySelector('.total').textContent = money(w.price * quantity); d.querySelector('[data-quantity="-1"]').disabled = quantity <= 1; d.querySelector('[data-quantity="1"]').disabled = quantity >= 3; };
  d.querySelectorAll('[data-quantity]').forEach(b => b.onclick = () => { quantity = Math.max(1, Math.min(3, quantity + Number(b.dataset.quantity))); update(); }); update();
  d.querySelector('.confirm').onclick = () => { saved.add(w.id); persist(); d.close(); render(); toast('已加入我的画册'); };
}
function go(path) { document.querySelector('dialog')?.close(); if (location.hash === `#${path}`) render(); else location.hash = path; }
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  if (b.dataset.open) go(`/item/${b.dataset.open}`);
  if (b.dataset.save) { const id = b.dataset.save; saved.has(id) ? saved.delete(id) : saved.add(id); persist(); render(); }
  if (b.dataset.step) { selectedId = works[(works.findIndex(w => w.id === selectedId) + Number(b.dataset.step) + works.length) % works.length].id; render(); }
  if (b.dataset.select) { selectedId = b.dataset.select; render(); }
  if (b.dataset.category) { category = b.dataset.category; render(); }
  if (b.dataset.eventFilter) { eventFilter = b.dataset.eventFilter; render(); }
  if (b.dataset.profileStep) { pageIndex += Number(b.dataset.profileStep); render(); }
  if (b.dataset.event) {
    if (b.dataset.event === 'season') modal('<p class="eyebrow">作品专题 / 幻境来信</p><h2>那些想留住的片刻</h2><p>潮汐信使、镜夜行者、晴空猎手与焰羽乐师，组成一卷关于日常与想象的原画故事。全部为原创生成的赛璐璐风格插画，不对应既有动漫 IP。</p><button class="primary" data-action="go-market">翻阅四幅原画 ' + icon('right') + '</button>');
    else modal('<p class="eyebrow">创作手记</p><h2>从线条，到一帧故事</h2><p>赛璐璐风格以清晰的轮廓与分明的明暗块面塑造人物。本次作品以当代动漫的精细线稿、鲜明色彩与动态构图呈现，所有角色均为原创设计。</p><p>当前为专题演示，尚未开放投稿或报名。</p>');
  }
  const action = b.dataset.action;
  if (action === 'search') searchDialog();
  if (action === 'edit-profile') editProfile();
  if (action === 'buy') buy();
  if (action === 'favorites') go('/collection');
  if (action === 'go-market') go('/market');
  if (action === 'reset') { category = '全部'; query = ''; if (state().collection) go('/market'); else render(); }
  if (action === 'about') modal('<p class="eyebrow">关于屿藏</p><h2>让故事，拥有一个位置。</h2><p>屿藏是一个原创数字插画展示原型。这里的角色、作者与发行信息均为演示内容；不代表既有动漫授权，也不提供真实交易或链上确权。</p>');
  if (action === 'notes') modal('<p class="eyebrow">作品与收藏须知</p><h2>只为喜欢，不为承诺。</h2><p>当前所有原画及发行数据均为演示内容，未接入真实支付、订单或区块链。收藏保存在当前浏览器，不代表版权转让，也不承诺收益。</p>');
  if (action === 'orders') modal('<p class="eyebrow">订单中心</p><h2>还没有订单</h2><p>展示原型不会创建订单或扣款。喜欢的作品可加入本机收藏画册。</p>');
  if (action === 'help') modal('<p class="eyebrow">帮助中心</p><h2>关于你的画册</h2><p>收藏和昵称保存在当前浏览器，清除浏览器数据会一并清除。当前不支持跨设备同步、真实支付与资产查询。</p>');
});
let startTouch = null;
app.addEventListener('touchstart', e => { if (e.target.closest('.feature-picture')) startTouch = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }; }, { passive: true });
app.addEventListener('touchend', e => {
  if (!startTouch || state().path !== '/') return;
  const dx = e.changedTouches[0].clientX - startTouch.x, dy = e.changedTouches[0].clientY - startTouch.y; startTouch = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) app.querySelector(`[data-step="${dx < 0 ? 1 : -1}"]`)?.click();
}, { passive: true });
document.addEventListener('keydown', e => { if (document.querySelector('dialog') || e.target.matches('input,select,textarea')) return; if (e.key === 'ArrowRight') app.querySelector('[data-step="1"]')?.click(); if (e.key === 'ArrowLeft') app.querySelector('[data-step="-1"]')?.click(); });
window.addEventListener('hashchange', () => { category = '全部'; query = ''; pageIndex = 0; render(); });
render();
