/* Carta: efecto al deslizar. Solo presentación; abrir productos y pedidos siguen en app.js.
   El producto que sale por la izquierda se desvanece y se encoge; el que entra por la derecha aparece suavemente. */
(()=>{
 const rail=document.getElementById('rail');if(!rail)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0;
 function clear(){for(const c of rail.children){c.style.opacity='';c.style.scale='';c.style.translate='';c.style.rotate='';}}
 function paint(){
  frame=0;
  if(reduced.matches){clear();return;}
  const box=rail.getBoundingClientRect(),start=box.left+(parseFloat(getComputedStyle(rail).paddingLeft)||0);
  for(const card of rail.children){
   const b=card.getBoundingClientRect();if(!b.width)continue;
   const p=(b.left-start)/b.width;
   if(p<0){ /* saliendo por la izquierda */
    const t=Math.min(1,-p);
    card.style.opacity=String(1-t*.9);card.style.scale=String(1-t*.16);
    card.style.translate=`${t*b.width*.38}px ${t*14}px`;card.style.rotate=`${-t*6}deg`;
   }else{ /* entrando por la derecha */
    const t=Math.min(1,Math.max(0,(b.right-box.right)/b.width));
    card.style.opacity=String(1-t*.45);card.style.scale=String(1-t*.07);
    card.style.translate=`0 ${t*8}px`;card.style.rotate=`${t*3}deg`;
   }
  }
 }
 const queue=()=>{if(!frame)frame=requestAnimationFrame(paint);};
 rail.addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);
 reduced.addEventListener('change',queue);
 new MutationObserver(()=>requestAnimationFrame(paint)).observe(rail,{childList:true});

 /* Pista para deslizar (pantallas táctiles): desaparece con el primer deslizamiento. */
 const hint=document.createElement('p');hint.className='swipe-hint';hint.setAttribute('aria-hidden','true');
 hint.innerHTML='Desliza para ver más <span class="swipe-finger">→</span>';
 (rail.parentElement.querySelector('.track')||rail).after(hint);
 rail.addEventListener('scroll',()=>{if(rail.scrollLeft>20)hint.classList.add('is-gone');},{passive:true});

 /* En computadora también se puede arrastrar con el mouse, como en el celular. */
 let drag=null,moved=false;
 rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button>0)return;drag={x:e.clientX,left:rail.scrollLeft};moved=false;});
 addEventListener('pointermove',e=>{
  if(!drag)return;const dx=e.clientX-drag.x;
  if(!moved&&Math.abs(dx)>6){moved=true;rail.classList.add('is-dragging');}
  if(moved){e.preventDefault();rail.scrollLeft=drag.left-dx;}
 });
 addEventListener('pointerup',()=>{
  if(!drag)return;drag=null;if(!moved)return;
  rail.classList.remove('is-dragging');
  /* Encajar en el producto más cercano. */
  const step=(rail.firstElementChild?.offsetWidth||1)+(parseFloat(getComputedStyle(rail).columnGap)||0);
  rail.scrollTo({left:Math.round(rail.scrollLeft/step)*step,behavior:reduced.matches?'auto':'smooth'});
 });
 rail.addEventListener('click',e=>{if(moved){e.stopImmediatePropagation();e.preventDefault();moved=false;}},true);
 rail.addEventListener('dragstart',e=>e.preventDefault());
 requestAnimationFrame(paint);
})();
