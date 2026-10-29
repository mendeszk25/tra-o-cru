/**
 * TRAÇO CRU — V16 / Editorial Motion Studio
 * Native WAAPI + IntersectionObserver, without remote scripts or scroll-jacking.
 * Key principle: original photographic artwork is STATIC; layers of type and UI move.
 * Effects are progressive: if this file fails, content is still visible and usable.
 */
(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const query = (s, node=doc) => node.querySelector(s);
  const all = (s, node=doc) => Array.from(node.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 650px)');
  const touch = matchMedia('(hover: none), (pointer: coarse)');
  let alive = !reduced.matches;
  if (!alive || !('animate' in Element.prototype) || !('IntersectionObserver' in window)) return;
  root.classList.add('motion-enabled');

  const ease = 'cubic-bezier(.18,1,.24,1)';
  const emphatic = 'cubic-bezier(.16,1,.30,1)';
  const outSine = 'cubic-bezier(.22,.78,.35,1)';
  const active = new Set();
  const playingNodes = new Map(); // Off-screen animations can safely settle on fast scroll
  let observer;
  let scrollRaf = 0;
  let lastWidth = innerWidth;
  const elements = {};
  const labels = [];

  function play(el, frames, opts={}) {
    if (!alive || !el) return;
    const animation = el.animate(frames, {duration: 900, easing: ease, fill:'backwards', ...opts});
    active.add(animation);
    playingNodes.set(animation, el);
    const cleanup = () => { active.delete(animation); playingNodes.delete(animation); };
    animation.addEventListener('finish', cleanup, {once:true});
    animation.addEventListener('cancel', cleanup, {once:true});
    return animation;
  }

  function lineSplit(el) {
    if (!el || el.dataset.motionSplit) return [];
    el.dataset.motionSplit='true';
    // No duplicate spoken content: visual spans replace text while remaining semantic.
    const nodes=Array.from(el.childNodes);
    const groups=[[]];
    nodes.forEach(node => {
      if (node.nodeType===1 && node.tagName==='BR') groups.push([]);
      else groups[groups.length-1].push(node);
    });
    const result=[];
    const fragment=doc.createDocumentFragment();
    for (const group of groups) {
      if (result.length) fragment.appendChild(doc.createTextNode(' '));
      const clip=doc.createElement('span');
      clip.className='motion-line-clip';
      const inner=doc.createElement('span');
      inner.className='motion-line-inner';
      group.forEach(node=>inner.appendChild(node));
      clip.appendChild(inner);
      fragment.appendChild(clip);
      result.push(inner);
    }
    el.replaceChildren(fragment);
    return result;
  }

  function lineEntrance(el, {big=false, stagger=130, delay=0}={}) {
    const lines = lineSplit(el);
    lines.forEach((line, i) => play(line, [
      {transform:`translate3d(0,${big?'78%':'65%'},0) skewY(${big?'3':'2'}deg)`,opacity:.72},
      {transform:'translate3d(0,0,0) skewY(0deg)',opacity:1}
    ], {duration:big?(mobile.matches?760:980):(mobile.matches?590:760), delay:Math.round(delay*.60)+i*Math.min(stagger,125), easing:emphatic}));
  }

  function entrance(el, style='rise', delay=0, duration=950) {
    if (!el) return;
    const options = {
      rise:[{opacity:.36,transform:`translate3d(0,${mobile.matches?30:48}px,0) rotateX(4deg)`},{opacity:1,transform:'translate3d(0,0,0) rotateX(0)'}],
      left:[{opacity:.4,transform:'translate3d(-52px,13px,0) rotate(-1.5deg)'},{opacity:1,transform:'translate3d(0,0,0) rotate(0deg)'}],
      right:[{opacity:.4,transform:'translate3d(52px,13px,0) rotate(1.5deg)'},{opacity:1,transform:'translate3d(0,0,0) rotate(0deg)'}],
      veil:[{opacity:.6,clipPath:'inset(42% 0 0 0)',transform:'translate3d(0,24px,0)'},{opacity:1,clipPath:'inset(0 0 0 0)',transform:'translate3d(0,0,0)'}],
      iris:[{opacity:.75,clipPath:'circle(28% at 45% 48%)'},{opacity:1,clipPath:'circle(80% at 50% 50%)'}],
      sweep:[{opacity:.5,clipPath:'inset(0 70% 0 0)',transform:'translate3d(18px,0,0)'},{opacity:1,clipPath:'inset(0 0 0 0)',transform:'translate3d(0,0,0)'}]
    };
    return play(el, options[style] || options.rise, {delay:Math.round(delay*.54), duration:mobile.matches?Math.min(680,Math.round(duration*.70)):Math.min(960,duration), easing:emphatic});
  }

  function staggerChildren(node, selectors, scheme='rise', step=120, initial=0) {
    if (!node) return;
    all(selectors,node).forEach((item,i)=>entrance(item,scheme,initial+i*step,790));
  }

  function drawPath(svg, delay=0, duration=1700) {
    if (!svg) return;
    all('path',svg).forEach((path,i)=>{
      // Measure using real SVG geometry, avoiding magic path-length assumptions.
      let length=0;
      try{ length=path.getTotalLength(); }catch(e){return;}
      if (!length) return;
      path.style.strokeDasharray=String(length);
      path.style.strokeDashoffset='0';
      play(path,[{strokeDashoffset:length,opacity:.2},{strokeDashoffset:0,opacity:1}],{duration,delay:delay+i*90,easing:outSine});
    });
  }

  function hero() {
    const stage=query('.hero__stage');
    const first=query('.hero__word--one');
    const second=query('.hero__word--two');
    const label=query('.hero__headline .eyebrow');
    const title=query('.hero__headline h1');
    const aside=query('.hero__aside');
    const overlines=all('.hero__overline span');
    // The PRODUCT PHOTOGRAPH is intentionally not animated.
    play(first,[
      {clipPath:'inset(0 75% 0 0)',opacity:.65,transform:'translate3d(-5%,0,0) scale(1.055)'},
      {clipPath:'inset(0 0 0 0)',opacity:1,transform:'translate3d(0,0,0) scale(1)'}
    ],{duration:mobile.matches?980:1330,easing:emphatic,delay:80});
    play(second,[
      {clipPath:'inset(55% 0 0 0)',opacity:.6,transform:'translate3d(5%,5%,0) scale(.95)'},
      {clipPath:'inset(0 0 0 0)',opacity:1,transform:'translate3d(0,0,0) scale(1)'}
    ],{duration:mobile.matches?1040:1410,easing:emphatic,delay:170});
    overlines.forEach((node,i)=>entrance(node,i?'right':'left',250+i*100,850));
    entrance(label,'rise',550,760);
    lineEntrance(title,{big:true,delay:mobile.matches?380:550,stagger:120});
    entrance(aside, 'right', mobile.matches?680:870,770);
    entrance(query('.hero__bottom'), 'rise',720,700);
    // Hero exit is synchronized with *natural scroll* via CSS variables,
    // never pinned; no blank or artificial scroll space.
    elements.hero=stage;
    elements.first=first;
    elements.second=second;
  }

  const scenes = [
    {
      selector:'.manifesto',
      action(node) {
        entrance(query('.manifesto__top'), 'sweep',0,780);
        lineEntrance(query('.manifesto h2'),{big:true,delay:180,stagger:190});
        entrance(query('.manifesto__copy .section-intro'),'left',180,700);
        entrance(query('.manifesto__body'),'left',640,1050);
        entrance(query('.manifesto__copy .text-link'),'rise',950,740);
        // Photo reveals when it enters the viewport on narrow layouts.
        drawPath(query('.manifesto__rule svg'),300,1900);
        entrance(query('.manifesto__rule'),'sweep',700,1000);
      }
    },
    {
      selector:'.works',
      action(node) {
        lineEntrance(query('.works h2'),{big:true,stagger:190});
        entrance(query('.works__heading>p'), 'right',420,1050);
        entrance(query('.works__toolbar'),'sweep',350,800);
        // Cards are observed individually so lower rows animate when actually seen.
        entrance(query('.works__end'),'rise',750,900);
      }
    },
    {
      selector:'.material',
      action() {
        lineEntrance(query('.material h2'),{big:true,stagger:175});
        entrance(query('.material__header>p'),'right',390,890);
        // The experience panel has its own trigger further down the page.
      }
    },
    {
      selector:'.atelier',
      action() {
        entrance(query('.atelier__photo'),'veil',0,1470);
        lineEntrance(query('.atelier h2'),{big:true,delay:190,stagger:180});
        staggerChildren(query('.atelier__text'),'.atelier__lead, .atelier__text>p:not(.atelier__lead), blockquote, .text-link','right',140,420);
      }
    },
    {
      selector:'.ambience',
      action() {
        entrance(query('.ambience__image'),'sweep',0,1580);
        lineEntrance(query('.ambience h2'),{big:true,delay:230,stagger:190});
        entrance(query('.ambience__content p'),'right',550,1030);
        entrance(query('.ambience__content small'),'rise',750,900);
      }
    },
    {
      selector:'.courses',
      action() {
        // Monumental type and hand-drawn fibrous SVG in terracotta.
        lineEntrance(query('.courses h2'),{big:true,delay:160,stagger:220});
        entrance(query('.courses__top'),'sweep',0,850);
        entrance(query('.courses__info'),'right',480,1190);
        entrance(query('.courses__bottom'),'sweep',920,830);
        drawPath(query('.courses__imprint'),150,2300);
      }
    },
    {
      selector:'.contact',
      action() {
        lineEntrance(query('.contact h2'),{big:true,stagger:185,delay:150});
        entrance(query('.contact__heading>p'),'left',450,960);
        all('.contact__form > *').forEach((item,i)=>entrance(item,'rise',210+i*105,870));
      }
    },
    {
      selector:'.footer',
      action(){
        entrance(query('.footer__top'),'veil',0,1150);
        entrance(query('.footer__bottom'),'sweep',350,950);
      }
    }
  ];

  // V17.1: observe the *content* instead of the first pixels of a tall section.
  // The original 3%-of-section trigger could play a whole sequence before its title arrived.
  function observeScenes() {
    const anchors={
      '.manifesto':'.manifesto h2', '.works':'.works__heading',
      '.material':'.material__header', '.atelier':'.atelier__text',
      '.ambience':'.ambience__content', '.courses':'.courses__layout',
      '.contact':'.contact__heading', '.footer':'.footer__top'
    };
    const byAnchor=new Map();
    for(const scene of scenes){
      const section=query(scene.selector);
      const anchor=query(anchors[scene.selector]) || section;
      if(section && anchor) byAnchor.set(anchor,{scene,section});
    }
    observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting || !alive)continue;
        const item=byAnchor.get(entry.target);
        if(!item)continue;
        item.section.classList.add('motion-entered');
        item.scene.action(item.section);
        observer.unobserve(entry.target);
      }
    },{threshold:0,rootMargin:'0px 0px -18% 0px'});
    byAnchor.forEach((_,anchor)=>observer.observe(anchor));
  }

  function observeDetails() {
    const detailObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !alive) continue;
        const node = entry.target;
        if (node.classList.contains('work')) {
          const index = all('.work').indexOf(node);
          entrance(node,index%2?'right':'left',30,1120);
          const photo=query('.work__image',node);
          if (photo) play(photo,[
            {clipPath:'inset(0 0 95% 0)',transform:'scale(1.045)'},
            {clipPath:'inset(0 0 0 0)',transform:'scale(1)'}
          ],{duration:1100,delay:110,easing:emphatic});
        } else if (node.classList.contains('material__experience')) {
          entrance(query('.material__photo',node),'iris',0,1400);
          entrance(query('.material__controls',node),'right',240,1050);
          entrance(query('.material__folio'),'sweep',390,790);
        } else if (node.classList.contains('manifesto__picture')) {
          entrance(node,'veil',0,1420);
        }
        detailObserver.unobserve(node);
      }
    },{threshold:0,rootMargin:'0px 0px -17% 0px'});
    all('.work, .material__experience, .manifesto__picture').forEach(node=>detailObserver.observe(node));
    elements.detailObserver=detailObserver;
  }

  // Mobile navigation: staggered link reveal. Existing main.js maintains focus/inert.
  function menuMotion() {
    const menu=query('#mobile-nav');
    if (!menu) return;
    const obs=new MutationObserver(()=>{
      if (!alive || !menu.classList.contains('is-open')) return;
      all('a',menu).forEach((item,i)=>entrance(item,'left',i*85,660));
      entrance(query('.mobile-nav__foot',menu),'rise',330,650);
    });
    obs.observe(menu,{attributes:true,attributeFilter:['class']});
    elements.menuObserver=obs;
  }

  function dialogMotion() {
    for (const dialog of all('dialog')) {
      const mo=new MutationObserver(()=>{
        if (!alive || !dialog.open) return;
        play(dialog,[
          {opacity:0,transform:'translate3d(0,38px,0) scale(.955)'},
          {opacity:1,transform:'translate3d(0,0,0) scale(1)'}
        ],{duration:660,easing:emphatic});
        staggerChildren(dialog,'.piece-dialog__info > *, .message-dialog > h2, .message-dialog > p, .message-dialog__actions','rise',75,90);
      });
      mo.observe(dialog,{attributes:true,attributeFilter:['open']});
      labels.push(mo);
    }
  }

  // Gallery has independent pointer response, not fake 3D product rotation.
  function pointerMotion() {
    if (touch.matches) return;
    for (const card of all('.work__button')) {
      let raf=0;
      let x=0,y=0;
      const onMove=(e)=>{
        const box=card.getBoundingClientRect();
        x=((e.clientX-box.left)/box.width-.5)*2;
        y=((e.clientY-box.top)/box.height-.5)*2;
        if (raf) return;
        raf=requestAnimationFrame(()=>{
          card.style.setProperty('--motion-x',x.toFixed(3));
          card.style.setProperty('--motion-y',y.toFixed(3));
          raf=0;
        });
      };
      card.addEventListener('pointermove',onMove,{passive:true});
      card.addEventListener('pointerleave',()=>{
        card.style.setProperty('--motion-x','0');
        card.style.setProperty('--motion-y','0');
      });
    }
    // Magnetic arrow-only offset avoids moving accessible hit targets.
    all('.text-link, .header-contact, .works__direct, .button-outline, .contact__submit').forEach(el=>{
      let raf=0;
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        const x=((e.clientX-r.left)/r.width-.5)*11;
        const y=((e.clientY-r.top)/r.height-.5)*7;
        if (raf) return;
        raf=requestAnimationFrame(()=>{el.style.setProperty('--mag-x',`${x.toFixed(1)}px`);el.style.setProperty('--mag-y',`${y.toFixed(1)}px`);raf=0;});
      },{passive:true});
      el.addEventListener('pointerleave',()=>{el.style.setProperty('--mag-x','0px');el.style.setProperty('--mag-y','0px');});
    });
  }

  function updateScrollScene() {
    scrollRaf=0;
    if (!alive || !elements.hero) return;
    // A rapid scroll must not leave unrelated, half-hidden animations running.
    // Finish only those whose nodes are already outside the visible area.
    for(const [anim,node] of playingNodes){
      if(anim.playState !== 'running' || !node.isConnected)continue;
      const box=node.getBoundingClientRect();
      if(box.bottom < -innerHeight*.16 || box.top > innerHeight*1.16){
        try{anim.finish();}catch(_){}
      }
    }
    const rect=elements.hero.getBoundingClientRect();
    const distance=Math.min(1,Math.max(0,-rect.top/Math.max(1,rect.height)));
    root.style.setProperty('--hero-scroll',distance.toFixed(4));
    // These properties animate typography only; the photo remains static.
    elements.hero.style.setProperty('--editorial-scroll',distance.toFixed(4));
  }
  function onScroll() {if (!scrollRaf) scrollRaf=requestAnimationFrame(updateScrollScene);}
  function setupScrollScene() {
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll,{passive:true});
    onScroll();
  }

  function stopAnimation() {
    alive=false;
    root.classList.remove('motion-enabled');
    for (const animation of active) {try{animation.cancel();}catch(e){}}
    active.clear();
    playingNodes.clear();
    observer?.disconnect();
    elements.detailObserver?.disconnect();
    elements.menuObserver?.disconnect();
    labels.forEach(mo=>mo.disconnect());
    root.style.removeProperty('--hero-scroll');
    elements.hero?.style.removeProperty('--editorial-scroll');
    window.removeEventListener('scroll',onScroll);
    window.removeEventListener('resize',onScroll);
  }
  reduced.addEventListener?.('change',ev=>{if(ev.matches) stopAnimation();});
  hero();
  observeScenes();
  observeDetails();
  menuMotion();
  dialogMotion();
  pointerMotion();
  setupScrollScene();
})();
