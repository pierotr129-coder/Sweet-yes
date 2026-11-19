/* Carta en modo baraja: las tarjetas que genera app.js se apilan como un mazo.
   Solo cambia la presentación; abrir un producto y los pedidos siguen en app.js. */
(()=>{
 const rail=document.getElementById('rail'),prev=document.getElementById('prev'),next=document.getElementById('next');
 if(!rail||!prev||!next)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const section=rail.closest('.catalog');section.classList.add('deck-mode');
 rail.classList.add('deck');rail.onscroll=null;
 /* Barra de control: flechas, contador y segmentos de avance. */
 const bar=document.createElement('div');bar.className='deck-bar';
 bar.innerHTML='<div class="deck-count" aria-live="polite"><b>01</b><span>/</span><i>01</i></div><div class="deck-segments" aria-hidden="true"></div><p class="deck-hint">Desliza la carta para barajar</p>';
 bar.prepend(prev);bar.append(next);
 rail.after(bar);
 const countNow=bar.querySelector('b'),countAll=bar.querySelector('i'),segs=bar.querySelector('.deck-segments');
 let cards=[],index=0,drag=null,dragged=false;
 const pad=n=>String(n).padStart(2,'0');
 function layout(){
  cards=[...rail.children];
  const n=cards.length;if(!n)return;
  index=Math.min(index,n-1);
  cards.forEach((card,i)=>{
   const k=i-index;card.dataset.k=k;
   card.classList.toggle('is-top',k===0);
   card.setAttribute('aria-hidden',String(k!==0));
   card.querySelector('button')?.setAttribute('tabindex',k===0?'0':'-1');
   card.style.setProperty('--k',k);
   card.style.zIndex=String(100-Math.abs(k));

  });
  /* El alto sigue a la carta de arriba (la estrella es más alta que las demás). */
  rail.style.height=(cards[index].offsetHeight+34)+'px';
  countNow.textContent=pad(index+1);countAll.textContent=pad(n);
  if(segs.childElementCount!==n)segs.innerHTML=cards.map(()=>'<i></i>').join('');
  [...segs.children].forEach((s,i)=>s.classList.toggle('on',i<=index));
  prev.disabled=index===0;next.disabled=false;
  next.setAttribute('aria-label',index===n-1?'Volver a la primera carta':'Siguiente producto');
 }
 function go(dir){
  const n=cards.length;if(!n)return;
  index=dir>0?(index+1)%n:Math.max(0,index-1);
  layout();
 }
 /* app.js reprograma estas acciones al iniciar; aquí se reemplazan por las de la baraja. */
 prev.onclick=()=>go(-1);next.onclick=()=>go(1);
 rail.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(e.key==='ArrowRight'?1:-1);}};
 /* Al cambiar de categoría, app.js vuelve a dibujar las tarjetas: la baraja empieza desde arriba. */
 new MutationObserver(()=>{index=0;requestAnimationFrame(layout);}).observe(rail,{childList:true});
 addEventListener('resize',()=>requestAnimationFrame(layout));
 /* Arrastrar la carta de arriba: si pasa el umbral, sale volando y se asoma la siguiente. */
 rail.addEventListener('pointerdown',e=>{
  const top=e.target.closest('.card.is-top');if(!top||e.button>0)return;
  drag={x:e.clientX,y:e.clientY,card:top,dx:0,id:e.pointerId};dragged=false;
 });
 rail.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  drag.dx=e.clientX-drag.x;const dy=e.clientY-drag.y;
  if(!dragged&&Math.abs(drag.dx)>8&&Math.abs(drag.dx)>Math.abs(dy)){dragged=true;drag.card.setPointerCapture(e.pointerId);drag.card.classList.add('is-dragging');}
  if(dragged){e.preventDefault();drag.card.style.setProperty('--dx',drag.dx+'px');drag.card.style.setProperty('--rot',(drag.dx/18).toFixed(2)+'deg');}
 });
 function release(){
  if(!drag)return;const {card,dx}=drag;drag=null;
  card.classList.remove('is-dragging');
  if(dragged&&Math.abs(dx)>70){card.style.setProperty('--fly',dx>0?'1':'-1');card.classList.add('is-flying');setTimeout(()=>{card.classList.remove('is-flying');['--dx','--rot','--fly'].forEach(p=>card.style.removeProperty(p));},reduced.matches?0:420);go(1);}
  else{card.style.removeProperty('--dx');card.style.removeProperty('--rot');}
 }
 rail.addEventListener('pointerup',release);rail.addEventListener('pointercancel',release);
 /* Si fue un arrastre, no abrir el producto al soltar. */
 rail.addEventListener('click',e=>{if(dragged){e.stopImmediatePropagation();e.preventDefault();dragged=false;}},true);
 requestAnimationFrame(layout);
})();
