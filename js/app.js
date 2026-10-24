/* Monta a página a partir de dados.js e liga as animações (GSAP + ScrollTrigger + Lenis). */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const temGsap = !!(window.gsap && window.ScrollTrigger);
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const celular = () => innerWidth <= 860;
  if (temGsap) document.documentElement.classList.add('js');

  const EQ = window.EQUIPAMENTOS, FASES = window.FASES;
  const foto = id => `midia/produtos/${id}.webp`;
  const imgEq = (id, extra = '') => `<img src="${foto(id)}" alt="${EQ[id].nome}" loading="lazy" decoding="async" ${extra}>`;

  /* ---------- WhatsApp ---------- */
  const linkWhats = texto => `https://wa.me/${window.WHATSAPP || ''}?text=${encodeURIComponent(texto)}`;
  const MSG = {
    geral: 'Olá, Mestre das Máquinas! Vim pelo site e quero um orçamento de locação.',
    foto: 'Olá, Mestre das Máquinas! Vou mandar uma foto do serviço para vocês indicarem a máquina.',
    mais: 'Olá, Mestre das Máquinas! Procuro um equipamento que não vi no site: '
  };
  $$('[data-whats]').forEach(a => (a.href = linkWhats(MSG[a.dataset.whats])));
  const msgEq = id => `Olá, Mestre das Máquinas! Quero um orçamento de locação: ${EQ[id].nome}.`;

  // cada clique que leva ao WhatsApp vira um evento (pronto para Google Analytics / Meta quando instalados)
  const registrar = (evento, extra = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: evento, ...extra });
  };
  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-evento]');
    if (el && el.tagName === 'A') registrar(el.dataset.evento, el.dataset.eq ? { equipamento: el.dataset.eq } : {});
  });

  /* ---------- empresa: contato, área atendida, dúvidas, formulário ---------- */
  const EMP = window.EMPRESA || {};
  const cidades = EMP.cidades || [];
  $('[data-area]').textContent = cidades.join(' · ');
  $('[data-contato]').innerHTML = '<h4>Atendimento</h4>'
    + `<a data-whats="geral" data-evento="whats_rodape" href="${linkWhats(MSG.geral)}" target="_blank" rel="noopener">WhatsApp${EMP.whatsapp ? ' · ' + EMP.whatsapp.replace(/^55(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3') : ''}</a>`
    + (EMP.telefone ? `<a href="tel:${EMP.telefone.replace(/\D/g, '')}">${EMP.telefone}</a>` : '')
    + (EMP.horario ? `<p class="rod-hora">${EMP.horario}</p>` : '')
    + (EMP.endereco ? (EMP.mapa ? `<a href="${EMP.mapa}" target="_blank" rel="noopener">${EMP.endereco}<br><span class="rod-mapa">Como chegar →</span></a>` : `<p>${EMP.endereco}</p>`) : '')
    + (EMP.instagram ? `<a href="https://www.instagram.com/${EMP.instagram}" target="_blank" rel="noopener">@${EMP.instagram}</a>` : '');
  $('[data-faq]').innerHTML = (window.FAQ || []).map((f, i) => `
    <details class="faq-item"${i === 0 ? ' open' : ''}>
      <summary>${f.p}<i aria-hidden="true"></i></summary>
      <p>${f.r.replace('{cidades}', cidades.join(', '))}</p>
    </details>`).join('');
  $('[data-datalist]').innerHTML = Object.values(EQ).map(e => `<option value="${e.nome}">`).join('');
  $('[data-cidades]').insertAdjacentHTML('beforeend', cidades.map(c => `<option>${c}</option>`).join('') + '<option>Outra cidade</option>');
  $('[data-form]').addEventListener('submit', ev => {
    ev.preventDefault();
    const f = ev.target, v = n => (f.elements[n].value || '').trim();
    const ok = v('equipamento') && v('cidade');
    $('[data-form-erro]').hidden = ok;
    if (!ok) { (v('equipamento') ? f.elements.cidade : f.elements.equipamento).focus(); return; }
    const data = v('inicio') ? v('inicio').split('-').reverse().join('/') : '';
    const linhas = [
      `Olá, Mestre das Máquinas!${v('nome') ? ` Sou ${v('nome')}.` : ''} Quero um orçamento de locação:`,
      `• Equipamento: ${v('equipamento')}`,
      `• Cidade da obra: ${v('cidade')}`,
      data && `• A partir de: ${data}`,
      v('periodo') && `• Período: ${v('periodo')}`,
      `• ${f.elements.entrega.value}`,
      v('obs') && `• Obs.: ${v('obs')}`
    ].filter(Boolean);
    registrar('whats_formulario', { equipamento: v('equipamento'), cidade: v('cidade') });
    window.open(linkWhats(linhas.join('\n')), '_blank', 'noopener');
  });

  /* ---------- montagem do conteúdo ---------- */
  $$('[data-total-eq]').forEach(el => (el.textContent = Object.keys(EQ).length));
  $$('[data-total-conj]').forEach(el => (el.textContent = window.CONJUNTOS.length));

  // capítulos do filme de abertura (1 por fase)
  const kitsDa = n => window.CONJUNTOS.map((c, i) => ({ ...c, i })).filter(c => c.fase === n);
  const kit = c => `
    <div class="kit">
      <div class="kit-txt"><h3>Kit ${c.nome}</h3><p>${c.itens.map(id => EQ[id].nome).join(' · ')}</p></div>
      <button class="kit-btn" type="button" data-conj-add="${c.i}">Orçar kit <i aria-hidden="true">+</i></button>
    </div>`;
  $('[data-caps]').insertAdjacentHTML('beforeend', FASES.map(f => `
    <article class="cap" data-cap="${f.n}">
      <span class="cap-num" aria-hidden="true">${pad(f.n)}</span>
      <p class="rotulo">Fase ${pad(f.n)} · ${f.nome}</p>
      <h2 class="cap-tit">${f.titulo.map(t => `<span class="ln"><span>${t}</span></span>`).join('')}</h2>
      <div class="kits">${kitsDa(f.n).map(kit).join('')}</div>
      <button class="cap-link" type="button" data-ver-fase="${f.n}">Ver equipamentos desta fase <i aria-hidden="true">→</i></button>
    </article>`).join(''));
  const NOMES_CAP = ['Kits', ...FASES.map(f => f.curto)];
  $('[data-indice]').innerHTML = NOMES_CAP.map((t, i) => `<button type="button" data-ir-cap="${i}" aria-label="${t}"><span>${t}</span>${pad(i)}</button>`).join('');
  $('[data-ancoras]').innerHTML = NOMES_CAP.map((t, i) => `<span id="cap-${i}"></span>`).join('');

  // catálogo
  const ordem = Object.keys(EQ).sort((a, b) => (!!EQ[b].destaque - !!EQ[a].destaque) || (EQ[a].fases[0] - EQ[b].fases[0]));
  $('[data-grade]').innerHTML = ordem.map(id => {
    const e = EQ[id];
    return `
    <article class="eq" id="eq-${id}" data-fases="${e.fases.join(' ')}" data-destaque="${e.destaque ? 1 : 0}" data-busca="${(e.nome + ' ' + (e.det || '')).toLowerCase()}">
      <div class="eq-img">${imgEq(id)}${e.destaque ? '<span class="eq-tag">Mais pedido</span>' : ''}</div>
      <div class="eq-corpo">
        <h3>${e.nome}</h3>
        ${e.det ? `<p class="eq-det">${e.det}</p>` : ''}
        <p class="eq-fases">${e.fases.map(n => FASES[n - 1].curto).join(' · ')}</p>
      </div>
      <div class="eq-acoes">
        <a class="eq-orcar" href="${linkWhats(msgEq(id))}" target="_blank" rel="noopener" data-evento="whats_equipamento" data-eq="${id}"><svg class="ic"><use href="#i-whats"/></svg>Orçar</a>
        <button class="eq-add" type="button" data-add="${id}" aria-label="Adicionar ${e.nome} à lista" title="Adicionar à lista de orçamento"><span>Adicionar</span><span aria-hidden="true">+</span></button>
      </div>
    </article>`;
  }).join('');

  // filtros
  const filtros = [{ v: 'todos', t: 'Todos' }, ...FASES.map(f => ({ v: String(f.n), t: f.curto, n: pad(f.n) })), { v: 'destaque', t: 'Mais pedidos' }];
  $('[data-filtros]').innerHTML = filtros.map((f, i) =>
    `<button class="filtro" role="tab" type="button" data-filtro="${f.v}" aria-selected="${i === 0}">${f.n ? `<b>${f.n}</b>` : ''}${f.t}</button>`).join('');
  let filtroAtual = 'todos';
  function filtrar() {
    const termo = $('[data-busca]').value.trim().toLowerCase();
    let visiveis = 0;
    $$('.eq').forEach(c => {
      const okF = filtroAtual === 'todos' || (filtroAtual === 'destaque' ? c.dataset.destaque === '1' : c.dataset.fases.split(' ').includes(filtroAtual));
      const okB = !termo || c.dataset.busca.includes(termo);
      c.classList.toggle('oculto', !(okF && okB));
      if (okF && okB) visiveis++;
    });
    $('[data-vazio]').hidden = visiveis > 0;
    if (filtroAtual !== 'todos' || termo) abrirCatalogo();
    $$('[data-filtro]').forEach(x => x.setAttribute('aria-selected', x.dataset.filtro === filtroAtual));
    if (temGsap) ScrollTrigger.refresh();
  }
  $('[data-filtros]').addEventListener('click', ev => {
    const b = ev.target.closest('[data-filtro]');
    if (!b) return;
    filtroAtual = b.dataset.filtro;
    filtrar();
  });
  $('[data-busca]').addEventListener('input', filtrar);
  function abrirCatalogo() {
    $('[data-grade]').classList.remove('recolhida');
    $('[data-ver-todos]').hidden = true;
  }

  /* ---------- lista de orçamento ---------- */
  let lista = [];
  try { lista = JSON.parse(localStorage.getItem('mm-lista') || '[]').filter(id => EQ[id]); } catch (e) { lista = []; }
  const salvar = () => { try { localStorage.setItem('mm-lista', JSON.stringify(lista)); } catch (e) { /* sem armazenamento */ } };
  let avisoT;
  function avisar(txt) {
    const a = $('[data-aviso]');
    a.textContent = txt; a.classList.add('on');
    clearTimeout(avisoT); avisoT = setTimeout(() => a.classList.remove('on'), 2200);
  }
  function atualizarEnvio() {
    const obs = $('[data-orc-obs]').value.trim();
    const txt = 'Olá, Mestre das Máquinas! Quero um orçamento de locação:\n'
      + lista.map(id => `• ${EQ[id].nome}`).join('\n')
      + (obs ? `\n\nObra / período: ${obs}` : '');
    $('[data-orc-enviar]').href = linkWhats(txt);
  }
  function renderLista() {
    $$('[data-contagem]').forEach(b => (b.textContent = lista.length));
    $('[data-orc-itens]').innerHTML = lista.map(id =>
      `<li>${imgEq(id)}<span>${EQ[id].nome}</span><button type="button" data-tirar="${id}" aria-label="Remover ${EQ[id].nome}">×</button></li>`).join('');
    $('[data-orc-vazia]').hidden = lista.length > 0;
    $('[data-orc-enviar]').classList.toggle('desativado', !lista.length);
    $$('[data-add]').forEach(b => {
      const tem = lista.includes(b.dataset.add);
      b.classList.toggle('na-lista', tem);
      b.firstElementChild.textContent = tem ? 'Na lista' : 'Adicionar';
    });
    atualizarEnvio();
    const fl = $('.fixo-lista .badge');
    fl.classList.remove('pulso'); void fl.offsetWidth; fl.classList.add('pulso');
  }
  function adicionar(ids) {
    ids.forEach(id => { if (!lista.includes(id)) lista.push(id); });
    salvar(); renderLista();
  }
  const abrirOrc = () => { document.body.classList.add('orc-aberto'); $('[data-orc]').setAttribute('aria-hidden', 'false'); lenis && lenis.stop(); };
  const fecharOrc = () => { document.body.classList.remove('orc-aberto'); $('[data-orc]').setAttribute('aria-hidden', 'true'); lenis && lenis.start(); };
  $('[data-orc-obs]').addEventListener('input', atualizarEnvio);
  $('[data-orc-limpar]').addEventListener('click', () => { lista = []; salvar(); renderLista(); });
  addEventListener('keydown', ev => { if (ev.key === 'Escape') fecharOrc(); });

  /* ---------- rolagem suave ---------- */
  let lenis = null;
  if (temGsap && !calmo && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const rolarPara = y => {
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else scrollTo({ top: y, behavior: calmo ? 'auto' : 'smooth' });
  };
  const topoDe = el => el.getBoundingClientRect().top + scrollY;

  /* ---------- cliques que ligam as seções ---------- */
  let realceT;
  function irParaEquip(id) {
    const card = $('#eq-' + id);
    if (card.classList.contains('oculto')) { filtroAtual = 'todos'; $('[data-busca]').value = ''; filtrar(); }
    abrirCatalogo();
    rolarPara(topoDe(card) - innerHeight / 2 + card.offsetHeight / 2);
    $$('.eq.realce').forEach(c => c.classList.remove('realce'));
    clearTimeout(realceT);
    setTimeout(() => card.classList.add('realce'), 500);
    realceT = setTimeout(() => card.classList.remove('realce'), 3200);
  }
  function verFase(n) {
    filtroAtual = String(n); $('[data-busca]').value = ''; filtrar();
    rolarPara(topoDe($('#equipamentos')));
  }
  document.addEventListener('click', ev => {
    const t = ev.target;
    let b;
    if ((b = t.closest('[data-ir-eq]'))) return irParaEquip(b.dataset.irEq);
    if ((b = t.closest('[data-ver-fase]'))) return verFase(+b.dataset.verFase);
    if (t.closest('[data-ver-todos]')) { abrirCatalogo(); if (temGsap) ScrollTrigger.refresh(); return; }
    if ((b = t.closest('[data-ir-cap]'))) return rolarPara(topoDe($('#cap-' + b.dataset.irCap)));
    if ((b = t.closest('[data-add]'))) {
      const id = b.dataset.add;
      if (lista.includes(id)) { lista = lista.filter(x => x !== id); salvar(); renderLista(); avisar('Removido da lista'); }
      else { adicionar([id]); avisar(`${EQ[id].nome} adicionado à lista`); }
      return;
    }
    if ((b = t.closest('[data-conj-add]'))) { adicionar(window.CONJUNTOS[+b.dataset.conjAdd].itens); abrirOrc(); return; }
    if ((b = t.closest('[data-tirar]'))) { lista = lista.filter(x => x !== b.dataset.tirar); salvar(); renderLista(); return; }
    if (t.closest('[data-abrir-orc]')) return abrirOrc();
    if (t.closest('[data-fechar-orc]')) return fecharOrc();
    const a = t.closest('a[href^="#"]');
    if (a && a.getAttribute('href').length > 1) {
      const alvo = $(a.getAttribute('href'));
      if (alvo) { ev.preventDefault(); rolarPara(alvo.id === 'topo' ? 0 : topoDe(alvo) - (/^cap-/.test(alvo.id) ? 0 : 70)); }
    }
  });

  renderLista();
  if (!temGsap) return;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- filme de abertura: a obra se transforma com a rolagem ---------- */
  const FILME = { clipes: 4, quadros: 60, pasta: 'midia/seq' };
  const filme = $('.filme'), canvas = $('.filme-canvas'), ctx = canvas.getContext('2d');
  const caps = $$('.cap'), botoesCap = $$('[data-ir-cap]');
  const TOTAL = FILME.clipes * FILME.quadros;
  const conjunto = () => (celular() || innerWidth * Math.min(devicePixelRatio || 1, 2) < 1400 ? 'm' : 'd');
  let quadros = [], carregados = 0, quadroAtual = 0, capAtivo = -1, desenhado = -1, serie = '';

  function carregarSerie() {
    const nova = conjunto();
    if (nova === serie) return;
    serie = nova; carregados = 0; filme.classList.remove('carregado');
    quadros = new Array(TOTAL);
    const ordem = [];
    for (let c = 0; c < FILME.clipes; c++) for (let i = 0; i < FILME.quadros; i += 4) ordem.push(c * FILME.quadros + i); // primeiro um quadro a cada 4
    for (let g = 0; g < TOTAL; g++) if (g % FILME.quadros % 4) ordem.push(g);                                          // depois o resto
    let i = 0;
    const proximo = () => {
      if (i >= ordem.length) return;
      const g = ordem[i++], c = Math.floor(g / FILME.quadros) + 1, q = g % FILME.quadros;
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => {
        if (img.naturalWidth) quadros[g] = img;
        carregados++;
        $('.filme-carga i').style.transform = `scaleX(${carregados / TOTAL})`;
        if (carregados === TOTAL) filme.classList.add('carregado');
        if (quadros[g] && g === 0 && !filme.classList.contains('pronto')) { filme.classList.add('pronto'); desenhado = -1; }
        proximo();
      };
      img.src = `${FILME.pasta}/${serie}/c${c}/${String(q + 1).padStart(3, '0')}.webp`;
    };
    for (let k = 0; k < 6; k++) proximo();
  }

  function quadroMaisProximo(g) {
    if (quadros[g]) return quadros[g];
    for (let d = 1; d < TOTAL; d++) {
      if (quadros[g - d]) return quadros[g - d];
      if (quadros[g + d]) return quadros[g + d];
    }
    return null;
  }

  function ajustarCanvas() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    desenhado = -1;
    const curso = filme.offsetHeight - innerHeight;
    $$('[data-ancoras] span').forEach((a, i) => (a.style.top = (i ? ((i + 0.64) / 5) * curso : 0) + 'px'));
  }

  function desenhar(g) {
    const img = quadroMaisProximo(g);
    if (!img) return;
    const cw = canvas.width, ch = canvas.height, iw = img.naturalWidth, ih = img.naturalHeight;
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, cw, ch);
    const borda = (x0, y0, x1, y1, rx, ry, rw, rh) => {
      const gr = ctx.createLinearGradient(x0, y0, x1, y1);
      gr.addColorStop(0, '#0A0A0A'); gr.addColorStop(1, 'rgba(10,10,10,0)');
      ctx.fillStyle = gr; ctx.fillRect(rx, ry, rw, rh);
    };
    if (cw / ch < 1) {
      // celular em pé: a maquete fica na parte de cima, o texto embaixo
      const dw = Math.min(cw * 1.95, ch * 0.5 * iw / ih), dh = dw * ih / iw;
      const dx = cw / 2 - dw * 0.675, dy = ch * 0.085;
      ctx.drawImage(img, dx, dy, dw, dh);
      borda(0, dy + dh, 0, dy + dh * 0.6, 0, dy + dh * 0.6, cw, dh * 0.4 + 2);
      borda(0, dy, 0, dy + dh * 0.15, 0, dy - 1, cw, dh * 0.15);
    } else {
      // um pouco menor que a tela, para o telhado não encostar no menu; bordas esfumadas no carvão
      const esc = Math.max(cw / iw, ch / ih) * 0.9, dw = iw * esc, dh = ih * esc;
      const dx = cw * 0.64 - dw * 0.665, dy = (ch - dh) / 2 + ch * 0.035, f = Math.min(dw, dh) * 0.09;
      ctx.drawImage(img, dx, dy, dw, dh);
      borda(0, dy, 0, dy + f, 0, dy - 1, cw, f + 1);
      borda(0, dy + dh, 0, dy + dh - f, 0, dy + dh - f, cw, f + 1);
      borda(dx + dw, 0, dx + dw - f, 0, dx + dw - f, 0, f + 1, ch);
      borda(dx, 0, dx + f, 0, dx - 1, 0, f + 1, ch);
    }
  }

  function mostrarCap(n) {
    if (n === capAtivo) return;
    const antigo = caps.find(c => +c.dataset.cap === capAtivo);
    capAtivo = n;
    botoesCap.forEach(b => b.classList.toggle('ativo', +b.dataset.irCap === Math.max(n, 0)));
    if (antigo) {
      gsap.killTweensOf(antigo.querySelectorAll('*'));
      gsap.to(antigo.querySelectorAll('.ln > span'), { yPercent: -110, duration: 0.5, ease: 'power3.in', stagger: 0.04 });
      gsap.to(antigo.querySelectorAll(':scope > :not(.cap-tit)'), {
        opacity: 0, y: -16, duration: 0.4, ease: 'power2.in', stagger: 0.03,
        onComplete: () => { if (+antigo.dataset.cap !== capAtivo) antigo.style.visibility = 'hidden'; }
      });
    }
    const novo = caps.find(c => +c.dataset.cap === n);
    if (!novo) return;
    gsap.killTweensOf(novo.querySelectorAll('*'));
    novo.style.visibility = 'visible';
    gsap.fromTo(novo.querySelectorAll('.ln > span'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.1, delay: antigo ? 0.25 : 0 });
    gsap.fromTo(novo.querySelectorAll(':scope > :not(.cap-tit)'), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: antigo ? 0.35 : 0.15 });
  }

  function progressoFilme() {
    const curso = filme.offsetHeight - innerHeight;
    const P = Math.min(1, Math.max(0, (scrollY - filme.offsetTop) / curso));
    const seg = Math.min(P * 5, 4.9999), k = Math.floor(seg), local = seg - k;
    const Q = FILME.quadros;
    let g = 0, cap = scrollY + innerHeight * 0.45 < filme.offsetTop ? -1 : 0;
    if (k > 0) {
      g = (k - 1) * Q + Math.min(1, local / 0.62) * (Q - 1);
      cap = local < 0.05 ? k - 1 : local > 0.32 ? k : -1;
    }
    return { P, g, cap };
  }

  ajustarCanvas();
  const iniciarFilme = () => { if (!serie) carregarSerie(); };
  addEventListener('load', () => setTimeout(iniciarFilme, 1200));
  ScrollTrigger.create({ trigger: filme, start: 'top 250%', once: true, onEnter: iniciarFilme });
  addEventListener('resize', () => { ajustarCanvas(); if (serie) carregarSerie(); });
  const rolar = $('.filme-rolar');
  gsap.ticker.add(() => {
    const { P, g, cap } = progressoFilme();
    quadroAtual = calmo ? g : quadroAtual + (g - quadroAtual) * 0.18;
    if (Math.abs(g - quadroAtual) < 0.01) quadroAtual = g;
    const q = Math.round(quadroAtual);
    if (q !== desenhado && filme.classList.contains('pronto')) { desenhar(q); if (quadros[q]) desenhado = q; }
    mostrarCap(cap);
    rolar.style.opacity = P > 0.01 ? 0 : 1;
  });
  // capa: as 4 peças do símbolo se encaixam, o nome aparece e o texto entra
  const pecas = $$('.capa .peca');
  gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 })
    .from('.nav', { y: -20, opacity: 0, duration: 1 }, 0.2)
    .from(pecas, { x: i => +pecas[i].dataset.dx * 70, y: i => +pecas[i].dataset.dy * 70, rotation: i => +pecas[i].dataset.dx * +pecas[i].dataset.dy * 35, opacity: 0, transformOrigin: '50% 50%', duration: 1.5, stagger: 0.07 }, 0)
    .from('.capa-aneis polygon', { scale: 0.7, opacity: 0, rotation: -25, transformOrigin: '50% 50%', duration: 1.8, stagger: 0.1 }, 0.1)
    .from('.marca-nome', { y: 14, opacity: 0, duration: 1 }, 0.8)
    .set('.capa-tit .ln > span, [data-capa]', { visibility: 'visible' }, 0.9)
    .from('.capa-assin', { opacity: 0, y: 14, duration: 0.9 }, 1)
    .from('.capa-tit .ln > span', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 1.1)
    .from('.capa-sub, .capa-cta', { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 1.4);
  gsap.to('.capa-aneis', { rotation: 360, transformOrigin: '50% 50%', duration: 120, repeat: -1, ease: 'none' });
  gsap.to('.capa-txt', { yPercent: -10, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.capa', start: '30% top', end: 'bottom top', scrub: true } });

  // novas seções entram ao rolar
  $$('.sec-cab, .provas, .passos, .rapido-txt, .faq').forEach(el => {
    gsap.from(el.children, { y: 34, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  $$('.passos-cta, .form, .cat-ferr').forEach(el => {
    gsap.from(el, { y: 34, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  // catálogo
  gsap.from('.cat-cab', { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.catalogo', start: 'top 80%' } });
  ScrollTrigger.batch('.eq', {
    start: 'top 92%', once: true,
    onEnter: b => gsap.fromTo(b, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: 'power3.out', overwrite: true })
  });

  // fechamento
  gsap.fromTo('.final-simbolo', { rotation: -30, scale: 0.8 }, { rotation: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  gsap.from('.final > :not(.final-simbolo)', { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.final', start: 'top 70%' } });

  // barra de progresso, menu e botão da lista
  const barra = $('.progresso span'), nav = $('.nav'), flut = $('[data-fixos]');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: s => {
      barra.style.transform = `scaleX(${s.progress})`;
      nav.classList.toggle('solida', scrollY > 30);
      document.body.classList.toggle('na-capa', scrollY < innerHeight * 0.6);
      flut.classList.toggle('visivel', scrollY > innerHeight * 0.5);
    }
  });
  document.body.classList.toggle('na-capa', scrollY < innerHeight * 0.6);
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
