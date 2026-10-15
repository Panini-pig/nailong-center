const sites = [
  {name:'奶龙大学', domain:'奶龙大学.com', type:'奶龙', target:'中飞院主题入口'},
  {name:'中国奶龙大学', domain:'中国奶龙大学.com', type:'奶龙', target:'大连理工大学'},
  {name:'奶龙交通大学', domain:'奶龙交通大学.com', type:'奶龙', target:'西安交通大学'},
  {name:'奶龙理工大学', domain:'奶龙理工大学.com', type:'奶龙', target:'华南理工大学'},
  {name:'北京奶龙大学', domain:'北京奶龙大学.com', type:'奶龙', target:'北京工业大学'},
  {name:'南京奶龙大学', domain:'南京奶龙大学.com', type:'奶龙', target:'南京航空航天大学'},
  {name:'浙江奶龙大学', domain:'浙江奶龙大学.com', type:'奶龙', target:'浙江中医药大学'},
  {name:'国立奶龙大学', domain:'国立奶龙大学.com', type:'奶龙', target:'兰州大学'},
  {name:'世界奶龙大学', domain:'世界奶龙大学.com', type:'奶龙', target:'大连理工相关站点'},
  {name:'奶龙学院', domain:'奶龙学院.com', type:'奶龙', target:'大连理工软件学院'},
  {name:'中国奶龙大学 ICU', domain:'中国奶龙大学.icu', type:'奶龙', target:'中国农业大学'},
  {name:'奶龙职业技术大学', domain:'奶龙职业技术大学.com', type:'奶龙', target:'山东大学'},
  {name:'中央奶龙大学', domain:'中央奶龙大学.com', type:'奶龙', target:'中央民族大学'},
  {name:'奶龙工学院', domain:'奶龙工学院.com', type:'奶龙', target:'东南大学'},
  {name:'四川奶龙大学', domain:'四川奶龙大学.cn', type:'奶龙', target:'四川大学'},
  {name:'奶龙工业大学', domain:'奶龙工业大学.com', type:'奶龙', target:'西北工业大学'},
  {name:'广东奶龙大学', domain:'广东奶龙大学.com', type:'奶龙', target:'哈工大（深圳）'},
  {name:'奶龙经贸大学', domain:'奶龙经贸大学.com', type:'奶龙', target:'奶龙主题门户'},
  {name:'中国奶龙大学 GAY', domain:'中国奶龙大学.gay', type:'奶龙', target:'中国农业大学'},
  {name:'苏州奶龙大学', domain:'苏州奶龙大学.icu', type:'奶龙', target:'苏州大学'},
  {name:'山东奶龙大学', domain:'山东奶龙大学.gay', type:'奶龙', target:'山东师范大学'},
  {name:'中国奶蛙大学', domain:'中国奶蛙大学.com', type:'奶蛙', target:'中国矿业大学'},
  {name:'世界奶蛙大学', domain:'世界奶蛙大学.com', type:'奶蛙', target:'东北大学'},
  {name:'奶蛙医科大学', domain:'奶蛙医科大学.com', type:'奶蛙', target:'虚构设定作品'},
  {name:'河海奶蛙情报站', domain:'hhu-naiwa.pages.dev', type:'奶蛙', target:'河海主题情报站'},
  {name:'深圳奶蛙大学', domain:'深圳奶蛙大学.com', type:'奶蛙', target:'深圳技术大学'},
  {name:'南京奶蛙大学', domain:'南京奶蛙大学.com', type:'奶蛙', target:'南京农业大学'},
  {name:'香港奶蛙大学', domain:'香港奶蛙大学.com', type:'奶蛙', target:'香港城市大学（东莞）'},
  {name:'奶蛙交通大学', domain:'奶蛙交通大学.com', type:'奶蛙', target:'上海交通大学'},
  {name:'宇宙奶蛙大学', domain:'宇宙奶蛙大学.com', type:'奶蛙', target:'深圳理工大学'}
].map((site, index) => ({...site, id:index + 1, url:`https://${site.domain}/`}));

const grid = document.querySelector('#site-grid');
const template = document.querySelector('#site-card-template');
const search = document.querySelector('#site-search');
const empty = document.querySelector('#empty-state');
const favoriteToggle = document.querySelector('#favorites-only');
const escort = document.querySelector('#escort');
const escortName = document.querySelector('#escort-name');
let activeFilter = 'all';
let favoritesOnly = false;
let pendingSite = null;
let departureTimer = null;
let soundEnabled = false;
let favorites = new Set(JSON.parse(localStorage.getItem('nailong-favorites') || '[]'));

function playTone(frequency = 520, duration = .09) {
  if (!soundEnabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(.05, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
  oscillator.addEventListener('ended', () => context.close());
}

function saveFavorites() {
  localStorage.setItem('nailong-favorites', JSON.stringify([...favorites]));
}

function renderSites() {
  const term = search.value.trim().toLowerCase();
  const filtered = sites.filter(site => {
    const matchesType = activeFilter === 'all' || site.type === activeFilter;
    const matchesSearch = `${site.name} ${site.domain} ${site.target}`.toLowerCase().includes(term);
    const matchesFavorite = !favoritesOnly || favorites.has(site.id);
    return matchesType && matchesSearch && matchesFavorite;
  });
  grid.replaceChildren();
  filtered.forEach(site => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.site-card');
    const main = fragment.querySelector('.card-main');
    const favorite = fragment.querySelector('.favorite');
    card.classList.toggle('is-frog', site.type === '奶蛙');
    fragment.querySelector('.site-index').textContent = String(site.id).padStart(2, '0');
    fragment.querySelector('.site-icon').textContent = site.type === '奶蛙' ? '🐸' : '✦';
    fragment.querySelector('.site-meta').textContent = `${site.type} · 可访问`;
    fragment.querySelector('.site-info strong').textContent = site.name;
    fragment.querySelector('.site-info small').textContent = `${site.domain} · ${site.target}`;
    favorite.classList.toggle('active', favorites.has(site.id));
    favorite.textContent = favorites.has(site.id) ? '★' : '☆';
    favorite.setAttribute('aria-label', `${favorites.has(site.id) ? '取消收藏' : '收藏'}${site.name}`);
    favorite.addEventListener('click', () => {
      favorites.has(site.id) ? favorites.delete(site.id) : favorites.add(site.id);
      saveFavorites(); renderSites();
    });
    main.addEventListener('click', () => startEscort(site));
    grid.append(fragment);
  });
  empty.hidden = filtered.length > 0;
}

function startEscort(site) {
  playTone(660, .14);
  pendingSite = site;
  escortName.textContent = site.name;
  escort.hidden = false;
  document.body.classList.add('modal-open');
  document.querySelector('.escort-track i').style.animation = 'none';
  requestAnimationFrame(() => {
    document.querySelector('.escort-track i').style.animation = '';
  });
  clearTimeout(departureTimer);
  departureTimer = setTimeout(depart, 2750);
}

function depart() {
  if (!pendingSite) return;
  window.location.href = pendingSite.url;
}

function closeEscort() {
  clearTimeout(departureTimer);
  pendingSite = null;
  escort.hidden = true;
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
  renderSites();
}));
search.addEventListener('input', renderSites);
document.addEventListener('keydown', event => {
  if (event.key === '/' && document.activeElement !== search) { event.preventDefault(); search.focus(); }
  if (event.key === 'Escape' && !escort.hidden) closeEscort();
});
favoriteToggle.addEventListener('click', () => {
  favoritesOnly = !favoritesOnly;
  favoriteToggle.setAttribute('aria-pressed', String(favoritesOnly));
  favoriteToggle.textContent = favoritesOnly ? '★ 显示全部' : '☆ 只看收藏';
  renderSites();
});
document.querySelector('#random-site').addEventListener('click', () => startEscort(sites[Math.floor(Math.random() * sites.length)]));
document.querySelector('#escort-close').addEventListener('click', closeEscort);
document.querySelector('#go-now').addEventListener('click', depart);

const soundToggle = document.querySelector('#sound-toggle');
soundToggle.addEventListener('click', () => {
  const on = soundToggle.getAttribute('aria-pressed') !== 'true';
  soundEnabled = on;
  soundToggle.setAttribute('aria-pressed', String(on));
  soundToggle.textContent = `音效：${on ? '开' : '关'}`;
  playTone(740, .12);
});

document.querySelector('#site-count').textContent = sites.length;
renderSites();
