/**
 * TRAÇO CRU — V17 / Cinematic editorial layer
 * Enhances V16 without replacing the original photograph, layout or business flows.
 * Pure browser APIs; the site remains fully usable if this script is unavailable.
 */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || !Element.prototype.animate || !('IntersectionObserver' in window)) return;
  const $=(q,n=document)=>n.querySelector(q);
  const $$=(q,n=document)=>Array.from(n.querySelectorAll(q));
  const mobile = matchMedia('(max-width: 650px)');
  const coarse = matchMedia('(hover: none), (pointer: coarse)');
  const ease='cubic-bezier(.16,1,.3,1)';
  const railEntries=[
    ['inicio','ABERTURA'],['manifesto','MANIFESTO'],['criacoes','CRIAÇÕES'],
    ['materia','MATÉRIA'],['atelie','ATELIÊ'],['ambience','AMBIENTES'],
    ['cursos','CURSOS'],['contato','CONTATO']
  ];
  let running=true, request=0;
  const animations=new Set();
  const triggers=[];
  const sections=$$('main > section');
  const windowAnimations=[];
  function animate(node,frames,config={}){
    if(!node||!running)return;
    const anim=node.animate(frames,{duration:1100,easing:ease,fill:'backwards',...config});
    animations.add(anim);
    const cleanup=()=>animations.delete(anim);
    anim.addEventListener('finish',cleanup,{once:true});
    anim.addEventListener('cancel',cleanup,{once:true});
    return anim;
  }
  // A decorative fine-line drawn as if by hand; SVG always excludes pointer events.
  function addInk(selector){
    const anchor=$(selector);
    if(!anchor)return;
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','tc-ink-stroke');
    svg.setAttribute('viewBox','0 0 1000 36');
    svg.setAttribute('preserveAspectRatio','none');
    svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d','M 0 19 C 135 7, 230 33, 355 16 S 605 27, 750 15 S 895 28, 1000 11');
    svg.append(path);
    anchor.append(svg);
    let total=0;
    try{total=path.getTotalLength();}catch(_){}
    if(total){
      path.style.strokeDasharray=String(total);
      // Only animate once the section is visible, never conceal the line indefinitely.
      const obs=new IntersectionObserver(entries=>{
        if(!running)return;
        for(const entry of entries){
          if(!entry.isIntersecting)continue;
          animate(path,[{strokeDashoffset:total,opacity:.45},{strokeDashoffset:0,opacity:1}],{duration:mobile.matches?1050:1700,delay:160});
          obs.disconnect();
        }
      },{threshold:0.12,rootMargin:'0px 0px -12% 0px'});
      obs.observe(svg);triggers.push(obs);
    }
  }
  addInk('.works__heading');
  addInk('.contact__heading');
  
  // Editorial chapter rail: unobtrusive, noninteractive, and hidden on small screens.
  let rail=null, railLabel=null, railCount=null, railFill=null;
  function createRail(){
    rail=document.createElement('div');
    rail.className='tc-chapter-rail';
    rail.setAttribute('aria-hidden','true');
    rail.innerHTML='<span class="tc-chapter-count">01 / 08</span><span class="tc-chapter-name">ABERTURA</span><span class="tc-chapter-track"><span class="tc-chapter-fill"></span></span>';
    document.body.append(rail);
    railLabel=$('.tc-chapter-name',rail);
    railCount=$('.tc-chapter-count',rail);
    railFill=$('.tc-chapter-fill',rail);
  }
  createRail();
  // Scrolling does not move the product image. It only updates decorative layers.
  const monitored=['.hero','.manifesto','.works','.material','.atelier','.ambience','.courses','.contact'];
  const monitoredNodes=monitored.map(q=>$(q));
  function updateScroll(){
    request=0;
    if(!running)return;
    const h=innerHeight||1;
    let index=0,closest=Infinity;
    for(let i=0;i<monitoredNodes.length;i++){
      const node=monitoredNodes[i];if(!node)continue;
      const r=node.getBoundingClientRect();
      // Local scene progress is clamped: 0 on arrival, 1 as section leaves.
      const p=Math.min(1,Math.max(0,(h*.83-r.top)/(r.height+h*.65)));
      node.style.setProperty('--tc-scene-progress',p.toFixed(4));
      const dist=Math.abs((r.top+r.bottom)/2-h*.45);
      if(dist<closest){closest=dist;index=i;}
    }
    if(rail){
      railCount.textContent=String(index+1).padStart(2,'0')+' / 08';
      const chosen=railEntries[index];
      railLabel.textContent=chosen?chosen[1]:'TRAÇO CRU';
      railFill.style.transform=`scaleY(${((index+1)/8).toFixed(4)})`;
      rail.classList.toggle('tc-rail-active',scrollY>innerHeight*.5);
    }
  }
  const onScroll=()=>{if(!request)request=requestAnimationFrame(updateScroll);};
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll,{passive:true});
  updateScroll();

  // V17.1: a narrow traveling ink/light accent replaces the opaque paper gates.
  // It never covers copy, photography, controls or navigation.
  function installSceneAccent(selector,variant){
    const section=$(selector);if(!section)return;
    const accent=document.createElement('div');
    accent.className='tc-scene-accent tc-accent-'+variant;
    accent.setAttribute('aria-hidden','true');
    accent.innerHTML='<span class="tc-scene-accent__line"></span>';
    section.append(accent);
    const line=$('.tc-scene-accent__line',accent);
    const anchor=$('h2',section)||section;
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting||!running)continue;
        observer.disconnect();
        animate(line,[
          {transform:'translate3d(-75%,0,0) scaleX(.16)',opacity:0},
          {transform:'translate3d(0,0,0) scaleX(1)',opacity:.9,offset:.55},
          {transform:'translate3d(22%,0,0) scaleX(.55)',opacity:0}
        ],{duration:mobile.matches?930:1250,easing:'cubic-bezier(.22,.75,.25,1)'});
      }
    },{threshold:0,rootMargin:'0px 0px -24% 0px'});
    observer.observe(anchor);triggers.push(observer);
  }
  installSceneAccent('.manifesto','mineral');
  installSceneAccent('.courses','terra');

  // Gallery: three authored compositions, with physical frame edges and light.
  $$('.work').forEach((work,i)=>{
    work.dataset.tcEdition=String(i+1).padStart(2,'0')+' / 03';
    const image=$('.work__image',work);
    if(!image)return;
    image.classList.add('tc-image-frame');
    if(coarse.matches)return;
    let raf=0;
    const onPointer=e=>{
      if(raf)return;
      const r=image.getBoundingClientRect();
      const px=Math.min(100,Math.max(0,100*(e.clientX-r.left)/r.width));
      const py=Math.min(100,Math.max(0,100*(e.clientY-r.top)/r.height));
      raf=requestAnimationFrame(()=>{
        image.style.setProperty('--tc-light-x',px.toFixed(1)+'%');
        image.style.setProperty('--tc-light-y',py.toFixed(1)+'%');
        raf=0;
      });
    };
    image.addEventListener('pointermove',onPointer,{passive:true});
    image.addEventListener('pointerleave',()=>{
      image.style.removeProperty('--tc-light-x');
      image.style.removeProperty('--tc-light-y');
    });
  });

  // Give the primary CTA a tangible response on touch without delay or hijacking.
  if(coarse.matches){
    const hit=$$('.work__button,.button-outline,.contact__submit,.text-link,.menu-toggle');
    for(const button of hit){
      button.addEventListener('pointerdown',()=>animate(button,[
        {filter:'brightness(1)',transform:'scale(1)'},
        {filter:'brightness(.94)',transform:'scale(.985)'},
        {filter:'brightness(1)',transform:'scale(1)'}
      ],{duration:370,easing:'ease-out'}),{passive:true});
    }
  }

  // The exact photographic texture is unchanged; the photographic frame may move.
  const imageObserver=new IntersectionObserver(entries=>{
    if(!running)return;
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      const el=entry.target;
      const frame=$('img',el);
      if(frame && !mobile.matches){
        animate(frame,[{transform:'scale(1.095) translateY(2%)'},
          {transform:'scale(1) translateY(0)'}],
          {duration:1500,easing:'cubic-bezier(.18,1,.22,1)'});
      }
      imageObserver.unobserve(el);
    }
  },{threshold:.15,rootMargin:'0px 0px -12% 0px'});
  $$('.manifesto__picture,.atelier__photo,.ambience__image').forEach(el=>imageObserver.observe(el));
  triggers.push(imageObserver);

  // Micro-interaction of the header mark, while the product artwork stays untouched.
  const logo=$('.identity__symbol');
  if(logo)animate(logo,[
    {opacity:0,transform:'translate3d(-12px,-7px,0) rotate(-16deg) scale(.84)'},
    {opacity:1,transform:'translate3d(0,0,0) rotate(0) scale(1)'}
  ],{duration:1150,delay:120});

  reduce.addEventListener?.('change',event=>{
    if(!event.matches)return;
    running=false;
    for(const animation of animations){try{animation.cancel();}catch(_) {}}
    animations.clear();
    for(const observer of triggers)observer.disconnect();
    removeEventListener('scroll',onScroll);
    removeEventListener('resize',onScroll);
    monitoredNodes.forEach(node=>node?.style.removeProperty('--tc-scene-progress'));
    $$('.tc-scene-accent').forEach(el=>el.remove());
    rail?.remove();
  });
})();
