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

// 奶龙游乐场
const gameModal = document.querySelector('#game-modal');
const gameTitle = document.querySelector('#game-modal-title');
const gameStages = [...document.querySelectorAll('.game-stage')];
let activeGame = null;
let gameCleanup = () => {};

function openGame(name) {
  gameCleanup();
  activeGame = name;
  gameModal.hidden = false;
  document.body.classList.add('modal-open');
  gameStages.forEach(stage => stage.hidden = true);
  const titles = {catch:'奶龙接金币', memory:'奶龙翻翻乐', reaction:'奶龙反应力'};
  gameTitle.textContent = titles[name];
  document.querySelector(`#${name}-game`).hidden = false;
  playTone(620, .12);
  if (name === 'catch') prepareCatchGame();
  if (name === 'memory') startMemoryGame();
  if (name === 'reaction') resetReactionGame();
}

function closeGame() {
  gameCleanup();
  gameCleanup = () => {};
  activeGame = null;
  gameModal.hidden = true;
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.play-game').forEach(button => button.addEventListener('click', () => openGame(button.dataset.game)));
document.querySelector('#game-close').addEventListener('click', closeGame);
gameModal.addEventListener('click', event => { if (event.target === gameModal) closeGame(); });

// 接金币
const catchField = document.querySelector('#catch-field');
const catchPlayer = document.querySelector('#catch-player');
const catchCurtain = document.querySelector('#catch-curtain');
let catchRunning = false;
let catchAnimation = 0;
let catchTimer = 0;
let catchSpawnTimer = 0;
let catchItems = [];
let catchPlayerX = .5;
let catchKeys = {left:false, right:false};

function prepareCatchGame() {
  stopCatchGame();
  catchField.classList.remove('is-playing');
  catchCurtain.hidden = false;
  catchCurtain.innerHTML = '<div class="curtain-icon">🪙</div><h3>奶龙接金币</h3><p>移动鼠标、手指或方向键接住金币，避开小炸弹。</p><button type="button" id="catch-start">开始游戏</button>';
  document.querySelector('#catch-start').addEventListener('click', startCatchGame);
  document.querySelector('#catch-score').textContent = '0';
  document.querySelector('#catch-time').textContent = '20';
  gameCleanup = stopCatchGame;
}

function moveCatchPlayer(clientX) {
  const rect = catchField.getBoundingClientRect();
  catchPlayerX = Math.max(.07, Math.min(.93, (clientX - rect.left) / rect.width));
  catchPlayer.style.left = `${catchPlayerX * 100}%`;
}

function catchPointerMove(event) { moveCatchPlayer(event.touches?.[0]?.clientX ?? event.clientX); }
function catchKeyDown(event) { if (event.key === 'ArrowLeft') catchKeys.left = true; if (event.key === 'ArrowRight') catchKeys.right = true; }
function catchKeyUp(event) { if (event.key === 'ArrowLeft') catchKeys.left = false; if (event.key === 'ArrowRight') catchKeys.right = false; }

function startCatchGame() {
  stopCatchGame();
  catchCurtain.hidden = true;
  catchField.classList.add('is-playing');
  catchRunning = true;
  let score = 0;
  let timeLeft = 20;
  let last = performance.now();
  catchField.addEventListener('pointermove', catchPointerMove);
  catchField.addEventListener('touchmove', catchPointerMove, {passive:true});
  addEventListener('keydown', catchKeyDown);
  addEventListener('keyup', catchKeyUp);
  const spawn = () => {
    if (!catchRunning) return;
    const bomb = Math.random() < .17;
    const element = document.createElement('span');
    element.className = 'falling-item';
    element.textContent = bomb ? '💣' : '🪙';
    element.style.left = `${6 + Math.random() * 88}%`;
    catchField.append(element);
    catchItems.push({element, bomb, y:-50, speed:180 + Math.random() * 130});
    catchSpawnTimer = setTimeout(spawn, 430 + Math.random() * 310);
  };
  spawn();
  catchTimer = setInterval(() => {
    timeLeft -= 1;
    document.querySelector('#catch-time').textContent = timeLeft;
    if (timeLeft <= 0) finishCatchGame(score);
  }, 1000);
  const frame = now => {
    if (!catchRunning) return;
    const dt = Math.min(.035, (now - last) / 1000); last = now;
    if (catchKeys.left) catchPlayerX = Math.max(.07, catchPlayerX - dt * .75);
    if (catchKeys.right) catchPlayerX = Math.min(.93, catchPlayerX + dt * .75);
    catchPlayer.style.left = `${catchPlayerX * 100}%`;
    const fieldRect = catchField.getBoundingClientRect();
    const playerRect = catchPlayer.getBoundingClientRect();
    catchItems = catchItems.filter(item => {
      item.y += item.speed * dt;
      item.element.style.transform = `translateY(${item.y}px) rotate(${item.y * .35}deg)`;
      const rect = item.element.getBoundingClientRect();
      if (rect.bottom >= playerRect.top + 12 && rect.top <= playerRect.bottom && rect.right >= playerRect.left && rect.left <= playerRect.right) {
        score = Math.max(0, score + (item.bomb ? -3 : 1));
        document.querySelector('#catch-score').textContent = score;
        playTone(item.bomb ? 150 : 780, .07);
        item.element.remove(); return false;
      }
      if (rect.top > fieldRect.bottom) { item.element.remove(); return false; }
      return true;
    });
    catchAnimation = requestAnimationFrame(frame);
  };
  catchAnimation = requestAnimationFrame(frame);
}

function stopCatchGame() {
  catchRunning = false;
  cancelAnimationFrame(catchAnimation);
  clearInterval(catchTimer); clearTimeout(catchSpawnTimer);
  catchItems.forEach(item => item.element.remove()); catchItems = [];
  catchField.removeEventListener('pointermove', catchPointerMove);
  catchField.removeEventListener('touchmove', catchPointerMove);
  removeEventListener('keydown', catchKeyDown); removeEventListener('keyup', catchKeyUp);
  catchKeys = {left:false, right:false};
}

function finishCatchGame(score) {
  stopCatchGame();
  catchField.classList.remove('is-playing');
  catchCurtain.hidden = false;
  catchCurtain.innerHTML = `<div class="curtain-icon">${score >= 15 ? '🏆' : '🪙'}</div><h3>获得 ${score} 枚金币</h3><p>${score >= 15 ? '奶龙今天满载而归！' : '再来一次，奶龙还能接更多。'}</p><button type="button" id="catch-start">再玩一次</button>`;
  document.querySelector('#catch-start').addEventListener('click', startCatchGame);
}

// 翻翻乐
const memoryIcons = ['🍗','🍉','🍰','🧋','🍟','🍩'];
function startMemoryGame() {
  const board = document.querySelector('#memory-board');
  const result = document.querySelector('#memory-result');
  let first = null, second = null, locked = false, moves = 0, pairs = 0;
  document.querySelector('#memory-moves').textContent = '0';
  document.querySelector('#memory-pairs').textContent = '0';
  result.hidden = true; board.hidden = false; board.replaceChildren();
  [...memoryIcons, ...memoryIcons].sort(() => Math.random() - .5).forEach((icon, index) => {
    const card = document.createElement('button');
    card.type = 'button'; card.className = 'memory-card'; card.dataset.icon = icon;
    card.innerHTML = `<span class="memory-face memory-back">✦</span><span class="memory-face memory-front">${icon}</span>`;
    card.setAttribute('aria-label', `第 ${index + 1} 张卡片`);
    card.addEventListener('click', () => {
      if (locked || card === first || card.classList.contains('matched')) return;
      card.classList.add('flipped'); playTone(540, .06);
      if (!first) { first = card; return; }
      second = card; moves += 1; document.querySelector('#memory-moves').textContent = moves;
      if (first.dataset.icon === second.dataset.icon) {
        first.classList.add('matched'); second.classList.add('matched');
        first = second = null; pairs += 1; document.querySelector('#memory-pairs').textContent = pairs; playTone(820, .1);
        if (pairs === memoryIcons.length) setTimeout(() => {
          board.hidden = true; result.hidden = false;
          document.querySelector('#memory-summary').textContent = `你用了 ${moves} 步完成全部配对。`;
        }, 550);
      } else {
        locked = true;
        setTimeout(() => { first.classList.remove('flipped'); second.classList.remove('flipped'); first = second = null; locked = false; }, 720);
      }
    });
    board.append(card);
  });
  document.querySelector('#memory-restart').onclick = startMemoryGame;
  gameCleanup = () => {};
}

// 反应力测试
const reactionPad = document.querySelector('#reaction-pad');
let reactionState = 'idle', reactionTimer = 0, reactionStarted = 0, reactionRound = 0, reactionTimes = [];
function resetReactionGame() {
  clearTimeout(reactionTimer); reactionState = 'idle'; reactionRound = 0; reactionTimes = [];
  reactionPad.className = 'reaction-pad idle';
  document.querySelector('#reaction-round').textContent = '0';
  document.querySelector('#reaction-average').textContent = '—';
  document.querySelector('#reaction-message').textContent = '点击开始测试';
  document.querySelector('#reaction-tip').textContent = '变黄之前不要点哦';
  gameCleanup = () => clearTimeout(reactionTimer);
}
function armReaction() {
  reactionState = 'waiting'; reactionPad.className = 'reaction-pad waiting';
  document.querySelector('#reaction-message').textContent = '等一等…';
  document.querySelector('#reaction-tip').textContent = '看到黄色再点击';
  reactionTimer = setTimeout(() => {
    reactionState = 'ready'; reactionStarted = performance.now(); reactionPad.className = 'reaction-pad ready';
    document.querySelector('#reaction-message').textContent = '现在点！'; document.querySelector('#reaction-tip').textContent = '快！';
    playTone(880, .08);
  }, 1100 + Math.random() * 2300);
}
reactionPad.addEventListener('click', () => {
  if (reactionState === 'idle') { reactionRound = 1; document.querySelector('#reaction-round').textContent = reactionRound; armReaction(); return; }
  if (reactionState === 'waiting') { clearTimeout(reactionTimer); reactionState = 'result'; reactionPad.className = 'reaction-pad result'; document.querySelector('#reaction-message').textContent = '点早啦！'; document.querySelector('#reaction-tip').textContent = '点击重新准备这一轮'; playTone(130,.1); return; }
  if (reactionState === 'ready') {
    const time = Math.round(performance.now() - reactionStarted); reactionTimes.push(time); reactionState = 'result'; reactionPad.className = 'reaction-pad result';
    const average = Math.round(reactionTimes.reduce((a,b) => a+b,0) / reactionTimes.length);
    document.querySelector('#reaction-average').textContent = `${average} ms`;
    document.querySelector('#reaction-message').textContent = `${time} 毫秒`;
    document.querySelector('#reaction-tip').textContent = reactionRound >= 5 ? `最终平均 ${average} 毫秒 · 点击再测一次` : '点击进入下一轮';
    playTone(720,.09); return;
  }
  if (reactionState === 'result') {
    if (reactionTimes.length >= 5) { resetReactionGame(); return; }
    if (reactionTimes.length === reactionRound) reactionRound += 1;
    document.querySelector('#reaction-round').textContent = reactionRound; armReaction();
  }
});
