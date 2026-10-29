'use strict';
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
const header = $('#site-header');
const progress = $('#reading-progress');
const menuToggle = $('#menu-toggle');
const mobileNav = $('#mobile-nav');
const menuBackground = [document.querySelector('main'), document.querySelector('footer'), $('.identity'), $('.desktop-nav'), $('.header-contact')].filter(Boolean);
const pieceDialog = $('#piece-dialog');
const messageDialog = $('#message-dialog');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
$('#footer-year').textContent = String(new Date().getFullYear());

// V16: a coreografia de entrada agora pertence a motion.js. Os elementos de
// conteúdo permanecem visíveis se animações estiverem desativadas ou falharem.

let frameRequested = false;
function updateScrollIndicators() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.max(0, Math.min(100, fraction))}%`;
  header.classList.toggle('is-scrolled', window.scrollY > 35);
  frameRequested = false;
}
window.addEventListener('scroll', () => {
  if (!frameRequested) { window.requestAnimationFrame(updateScrollIndicators); frameRequested = true; }
}, { passive: true });
updateScrollIndicators();

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileNav.classList.toggle('is-open', open);
  mobileNav.inert = !open;
  menuBackground.forEach(el => { el.inert = open; });
  document.body.classList.toggle('locked', open);
  if (open) { const focusFirst = () => { if (menuToggle.getAttribute('aria-expanded') === 'true') $('a', mobileNav)?.focus(); }; requestAnimationFrame(focusFirst); setTimeout(focusFirst, 240); }
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab' || menuToggle.getAttribute('aria-expanded') !== 'true') return;
  const links = $$('a', mobileNav);
  const first = links[0], last = links[links.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); menuToggle.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); menuToggle.focus(); }
});
menuToggle.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab' || menuToggle.getAttribute('aria-expanded') !== 'true') return;
  const links = $$('a', mobileNav);
  if (!links.length) return;
  if (event.shiftKey) { event.preventDefault(); links[links.length-1].focus(); }
  else { event.preventDefault(); links[0].focus(); }
});
$$('a', mobileNav).forEach(a => a.addEventListener('click', () => setMenu(false)));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false); menuToggle.focus();
  }
});
window.addEventListener('resize', () => { if (window.innerWidth > 900 && menuToggle.getAttribute('aria-expanded') === 'true') setMenu(false); });

// Editorial gallery: titles below are descriptive labels, not official product model names.
const pieces = {
  ambar: { title: 'O encontro da matéria e da luz', category: 'REGISTRO 001 / VASO ESCULTÓRICO', image: 'assets/vaso-ambar.webp', alt: 'Vaso em cimento com composição de folhagens terracota', copy: 'Vaso de acabamento mineral marcado por sulcos verticais e uma composição de folhagens em tonalidades quentes.' },
  brancas: { title: 'Silhuetas da natureza', category: 'REGISTRO 002 / FORMAS ORGÂNICAS', image: 'assets/formas-brancas.webp', alt: 'Objetos brancos de contornos orgânicos junto a difusor', copy: 'Composição de formas brancas irregulares, com silhuetas que evocam fragmentos encontrados na natureza.' },
  cinza: { title: 'Texturas do tempo', category: 'REGISTRO 003 / ESCULTURA', images: ['assets/escultura-cinza.webp', 'assets/relevo-cimento-recorte.webp'], image: 'assets/escultura-cinza.webp', alt: 'Escultura cinza de cimento', copy: 'Uma forma escultórica de superfície rugosa, nervuras altas e extremidades irregulares, reveladas pela luz lateral.' }
};
let selectedPiece = null;
// O acervo tem apenas três registros: filtros foram retirados até existirem mais peças.
// As fotografias complementares abaixo são apenas recortes reais já presentes no projeto.
const thumbs = $('#piece-dialog-thumbs');
function showPiecePhoto(piece, index=0) {
  const photos = piece.images ?? [piece.image];
  $('#piece-dialog-image').src = photos[index];
  $('#piece-dialog-image').alt = index ? `Detalhe fotográfico de ${piece.title}` : piece.alt;
  $$('.piece-dialog__thumb', thumbs).forEach((button,i) => {
    button.classList.toggle('is-active', i === index);
    button.setAttribute('aria-pressed', String(i === index));
  });
}
function populateThumbs(piece) {
  thumbs.replaceChildren();
  const photos = piece.images ?? [piece.image];
  if (photos.length < 2) { thumbs.hidden = true; return; }
  thumbs.hidden = false;
  photos.forEach((src, index) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'piece-dialog__thumb';
    b.setAttribute('aria-label', `${index===0?'Vista principal':'Detalhe'}: fotografia ${index+1} de ${photos.length}`);
    b.setAttribute('aria-pressed', String(index===0));
    const img = document.createElement('img');
    img.src = src; img.alt = ''; img.loading = 'lazy';
    b.appendChild(img);
    b.addEventListener('click', () => showPiecePhoto(piece,index));
    thumbs.appendChild(b);
  });
}
$$('[data-piece]').forEach(button => button.addEventListener('click', () => {
  const piece = pieces[button.dataset.piece]; if (!piece) return;
  selectedPiece = button.dataset.piece;
  $('#piece-dialog-title').textContent = piece.title;
  $('#piece-dialog-category').textContent = piece.category;
  $('#piece-dialog-copy').textContent = piece.copy;
  // Ficha técnica só exibe dados reais quando adicionados ao acervo.
  const specFields = [['medidas','Medidas'], ['acabamento','Acabamento'], ['disponibilidade','Disponibilidade'], ['encomenda','Encomendas']];
  const specs = $('#piece-dialog-specs');
  specs.replaceChildren();
  specFields.forEach(([field, label]) => {
    if (typeof piece[field] !== 'string' || !piece[field].trim()) return;
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = piece[field].trim();
    specs.append(dt,dd);
  });
  specs.hidden = specs.childElementCount === 0;
  populateThumbs(piece);
  showPiecePhoto(piece,0);
  const sourceImage = button.querySelector('.work__image img');
  const targetImage = $('#piece-dialog-image');
  // Same-document View Transition, only when supported and reduced motion is off.
  // On unsupported browsers a native dialog opens immediately.
  if (document.startViewTransition && !prefersReduced.matches && sourceImage) {
    sourceImage.style.viewTransitionName = 'piece-photo';
    const transition = document.startViewTransition(() => {
      sourceImage.style.viewTransitionName = '';
      targetImage.style.viewTransitionName = 'piece-photo';
      pieceDialog.showModal();
    });
    transition.finished.finally(() => { sourceImage.style.viewTransitionName = ''; targetImage.style.viewTransitionName = ''; });
  } else pieceDialog.showModal();
}));
$('#piece-dialog-close').addEventListener('click', () => pieceDialog.close());

// Physical detail viewing. Updates a transform only and works with touch / keyboard.
const detailZoom = $('#detail-zoom');
const detailPhoto = $('#detail-photo');
function updateDetailZoom() {
  const zoom = 1 + Number(detailZoom.value) / 1000;
  detailPhoto.style.setProperty('--zoom', zoom.toFixed(3));
  const label = zoom.toFixed(2).replace('.', ',') + '×';
  $('#detail-zoom-output').textContent = label;
  detailZoom.setAttribute('aria-valuetext', label);
}
detailZoom.addEventListener('input', updateDetailZoom);
updateDetailZoom();

// Inquiry workflow: creates a copyable message and opens the real Instagram profile.
function openMessage(text) {
  $('#message-text').value = text;
  $('#message-copy-status').textContent = '';
  $('#message-copy').textContent = 'Apenas copiar';
  if (pieceDialog.open) pieceDialog.close();
  messageDialog.showModal();
}
$('#piece-dialog-inquiry').addEventListener('click', () => {
  const piece = pieces[selectedPiece];
  if (!piece) return;
  openMessage(`Olá, Traço Cru! Gostaria de saber mais sobre a peça fotografada como “${piece.title}” (${piece.category}). Poderiam me informar disponibilidade, dimensões e valores?`);
});
$$('[data-inquiry]').forEach(button => button.addEventListener('click', () => {
  openMessage('Olá, Traço Cru! Tenho interesse nos cursos e oficinas de arte em cimento. Gostaria de saber mais sobre a proposta e sobre as próximas oportunidades.');
}));
$('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const nome = String(data.get('nome') ?? '').trim();
  const interesse = String(data.get('interesse') ?? '').trim();
  const mensagem = String(data.get('mensagem') ?? '').trim();
  if (!nome || !interesse || !mensagem) { event.currentTarget.reportValidity(); return; }
  openMessage(`Olá, Traço Cru! Meu nome é ${nome}.\n\nAssunto: ${interesse}.\n\n${mensagem}`);
});
$('#message-close').addEventListener('click', () => messageDialog.close());
$('#message-copy').addEventListener('click', async () => {
  const field = $('#message-text');
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(field.value);
    } else {
      field.focus(); field.select();
      const copied = document.execCommand('copy');
      if (!copied) throw new Error('Clipboard unavailable');
    }
    $('#message-copy-status').textContent = 'Texto copiado. Abra a conversa no Instagram e cole a mensagem para enviar.';
    $('#message-copy').textContent = 'Copiada ✓';
    setTimeout(() => { $('#message-copy').textContent = 'Apenas copiar'; }, 2000);
  } catch {
    field.focus(); field.select();
    $('#message-copy-status').textContent = 'Selecione e copie a mensagem manualmente (Ctrl+C ou toque prolongado).';
  }
});
// Backdrop click to close; Escape handled natively by dialog.
[pieceDialog, messageDialog].forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
});

// Prevent background scroll while native modal dialogs are open.
function syncDialogScrollLock() {
  document.body.classList.toggle('dialog-locked', pieceDialog.open || messageDialog.open);
}
const modalObserver = new MutationObserver(syncDialogScrollLock);
[pieceDialog, messageDialog].forEach(dialog => modalObserver.observe(dialog, {attributes:true,attributeFilter:['open']}));
const directLink = $('#message-instagram-direct').href;
$('#message-copy-open').addEventListener('click', () => {
  const field = $('#message-text');
  const status = $('#message-copy-status');
  let copyAttempt;
  // Start the clipboard operation within the user gesture before opening a new tab.
  try {
    if (navigator.clipboard && window.isSecureContext) {
      copyAttempt = navigator.clipboard.writeText(field.value).then(() => true, () => false);
    } else {
      field.focus(); field.select();
      copyAttempt = Promise.resolve(document.execCommand('copy'));
    }
  } catch { copyAttempt = Promise.resolve(false); }
  // With noopener some browsers return null even when the tab opened; do not infer a popup failure.
  window.open(directLink, '_blank', 'noopener,noreferrer');
  status.textContent = 'Abrindo o Instagram…';
  copyAttempt.then(copied => {
    status.textContent = copied
      ? 'Mensagem copiada! Cole o texto na conversa do Instagram para enviar.'
      : 'Cópia automática indisponível. Selecione a mensagem acima e copie manualmente.';
    status.textContent += ' Se o Instagram não abrir, use o link “Abrir conversa no Instagram”.';
  });
});
