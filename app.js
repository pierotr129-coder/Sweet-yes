(function(){
'use strict';
const data=window.SWEET_YES, $=id=>document.getElementById(id);
const find=id=>data.products.find(p=>p.id===id);
const money=n=>`S/ ${n.toFixed(2)}`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const realPhotos = {
 'fresas-con-crema-mediano':'vaso-catalogo',
 'fresas-con-crema-grande':'vaso-catalogo',
 'fresas-con-crema-maxi':'vaso-catalogo',
 'fresas-con-crema-1-litro':'vaso-catalogo',
 'sandwich-sweet':'sandwich-nuevo',
 'empanada-de-carne':'empanada-carne',
 'empanada-de-pollo':'empanada-pollo',
 'empanada-de-jamon-y-queso':'empanada-jamon',
 'frappe-oreo':'frappe-nuevo',
 'minidonas-clasicas-6-unidades': 'minidonas',
 'minidonas-sweet-10-unidades': 'minidonas',
 'minidonas-large-12-unidades': 'minidonas',
 'waffle-clasico': 'waffle-chispas',
 'waffle-sweet': 'waffle-oreo',
 'waffle-large': 'preparacion'
};
const photo = product => realPhotos[product.id]
 ? `assets/fotos-reales/${realPhotos[product.id]}-900.webp`
 : `assets/carta-web/${product.id}.webp`;
const featured=['fresas-con-crema-grande','waffle-sweet','minidonas-clasicas-6-unidades','frappe-oreo','crepa-especial','sandwich-sweet'];
const sizes=data.products.filter(p=>p.category==='fresas');
const rail=$('rail'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
const basket=[];
let category='featured', editing=-1;
const labels={fruit:'Frutas',cream:'Cremas',topping:'Toppings',sauce:'Jaleas'};
const choices={fruit:data.fruits,cream:data.creams,topping:data.toppings,sauce:['Fudge','Manjar','Leche condensada','Fresa','Maracuyá']};
const rules={
 'waffle-clasico':[1,0,1,1],'waffle-sweet':[1,1,2,1],'waffle-large':[2,2,3,2],
 'minidonas-clasicas-6-unidades':[1,0,1,2],'minidonas-sweet-10-unidades':[1,1,2,2],'minidonas-large-12-unidades':[2,1,3,2],
 'crepa-clasica':[1,0,0,1],'crepa-sweet':[1,0,0,1],'crepa-especial':[2,0,0,0]
};
function limits(p){const counts=p.category==='fresas'?[2,2,sizes.indexOf(p)+1,1]:rules[p.id]||[0,0,0,0];return Object.fromEntries(Object.keys(labels).map((k,i)=>[k,counts[i]]));}
function fresh(id){return {id,qty:1,fruit:[],cream:[],topping:[],sauce:[],omitted:[],notes:''};}
function extras(item){return find(item.id).category==='fresas'?Math.max(0,item.topping.length-limits(find(item.id)).topping):0;}
function surcharges(item){
 if(find(item.id).category!=='fresas')return [];
 const charges=[];
 if(item.fruit.length===1&&['Mango','Uvas'].includes(item.fruit[0]))charges.push({label:item.fruit[0]==='Mango'?'Solo mango':'Solo uva',amount:3});
 if(item.sauce.includes('Nutella'))charges.push({label:'Nutella',amount:3});
 if(extras(item))charges.push({label:`${extras(item)} topping(s) extra`,amount:extras(item)});
 return charges;
}
function price(item){const p=find(item.id);return p.price===null?null:(p.price+surcharges(item).reduce((total,c)=>total+c.amount,0))*item.qty;}
function describe(item){
 const lines=Object.keys(labels).filter(k=>item[k].length).map(k=>`${labels[k]}: ${item[k].join(', ')}`);
 for(const key of item.omitted||[])if(limits(find(item.id))[key])lines.push(key==='topping'?'Sin toppings':'Sin jaleas');
 for(const charge of surcharges(item))lines.push(`${charge.label}: +${money(charge.amount)} por vaso`);
 if(item.notes.trim())lines.push(`Indicaciones: ${item.notes.trim()}`);
 return lines;
}
function updateRail(){
 const extent=rail.scrollWidth-rail.clientWidth;
 $('prev').disabled=rail.scrollLeft<2;$('next').disabled=rail.scrollLeft>=extent-2;
 const marker=$('progress');marker.style.width=`${100*rail.clientWidth/Math.max(1,rail.scrollWidth)}%`;
 marker.style.transform=`translateX(${100*rail.scrollLeft/Math.max(1,rail.clientWidth)}%)`;
}
const animateCards=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('enter');animateCards.unobserve(entry.target);}},{threshold:.12});
function renderCatalog(){
 const products=category==='featured'?featured.map(find):category==='all'?data.products:data.products.filter(p=>p.category===category);
 animateCards.disconnect();
 rail.innerHTML=products.map((p,i)=>`<article class="card" style="--delay:${Math.min(i,3)*50}ms"><button data-id="${p.id}"><img loading="lazy" src="${photo(p)}" width="600" height="600" alt=""><h3>${esc(p.name)}</h3><span class="price">${p.price===null?'Consultar precio':money(p.price)}</span><span class="card-action">Ver opciones</span></button></article>`).join('');
 rail.scrollLeft=0;rail.querySelectorAll('.card').forEach(c=>animateCards.observe(c));
 $('filters').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.value===category));requestAnimationFrame(updateRail);
}
$('filters').innerHTML=Object.entries({featured:'Favoritos',...data.categoryTitles,all:'Toda la carta'}).map(([id,title])=>`<button value="${id}">${esc(title)}</button>`).join('');
$('filters').onclick=e=>{if(e.target.tagName==='BUTTON'){category=e.target.value;renderCatalog();}};
function slide(dir){rail.scrollBy({left:dir*(rail.firstElementChild.offsetWidth+parseFloat(getComputedStyle(rail).columnGap)),behavior:reduced.matches?'instant':'smooth'});}
$('prev').onclick=()=>slide(-1);$('next').onclick=()=>slide(1);rail.onscroll=updateRail;window.addEventListener('resize',updateRail);
rail.onkeydown=e=>{if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();slide(e.key==='ArrowRight'?1:-1);}};
function editor(host,item){
 const p=find(item.id),cup=p.category==='fresas',requirements=limits(p);
 item.omitted ||= [];
 const sizeRow=cup?`<fieldset><legend>Elige tu tamaño</legend>${sizes.map(s=>`<label class="choice"><input name="size" type="radio" value="${s.id}" ${item.id===s.id?'checked':''}>${esc(s.name.split(' · ')[1])}</label>`).join('')}</fieldset>`:'';
 const ordered=Object.entries(requirements).sort(([a],[b])=>cup?(a==='sauce'?-1:b==='sauce'?1:0):0);
 const groups=ordered.filter(([,n])=>n).map(([key,n])=>{
  const list=key==='sauce'&&(cup||p.id==='crepa-sweet')?[...choices.sauce,'Nutella']:choices[key];
  const optional=key==='topping'||key==='sauce';
  const hint=cup&&key==='sauce'?'Elige una jalea o marca «Sin jalea». Nutella añade S/ 3 por vaso.':optional?`Elige hasta ${n} o indica que no deseas.`:`Elige entre 1 y ${n}.`;
  return `<details data-key="${key}" ${cup&&key==='sauce'?'open':''}><summary>${labels[key]} <small></small></summary><p class="selection-hint">${hint}${cup&&key==='topping'?' Los adicionales cuestan S/ 1 por vaso.':cup&&key==='fruit'?' Solo mango o solo uva añade S/ 3 por vaso. Combinar dos frutas no lleva este recargo.':''}</p>${list.map(v=>`<label class="choice"><input name="${key}" value="${esc(v)}" type="${cup&&key==='sauce'?'radio':'checkbox'}" ${item[key].includes(v)?'checked':''}>${esc(v)}${cup&&key==='sauce'&&v==='Nutella'?' (+S/ 3)':''}</label>`).join('')}${optional?`<label class="choice choice-none"><input type="checkbox" name="omit-${key}" ${item.omitted.includes(key)?'checked':''}>${key==='sauce'?'Sin jalea':'Sin toppings'}</label>`:''}</details>`;
 });
 const firstStep=cup?groups.shift():'';
 host.innerHTML=`<form>${sizeRow}${firstStep}<p>${cup?`Incluye hasta 2 frutas, 2 cremas y ${requirements.topping} topping${requirements.topping>1?'s':''}. Puedes elegir menos. Solo mango o solo uva: +S/ 3 por vaso. Nutella: +S/ 3 por vaso. Los adicionales se suman.`:esc(p.description)}</p>${groups.join('')}<details><summary>Observaciones</summary><textarea name="notes" aria-label="Observaciones" maxlength="350" rows="2">${esc(item.notes)}</textarea></details><p class="extra-breakdown" aria-live="polite"></p><div class="quantity"><button type="button" data-step="-1" aria-label="Quitar una unidad">−</button><output aria-live="polite"></output><button type="button" data-step="1" aria-label="Añadir una unidad">+</button></div><p class="warning" role="alert"></p><div class="edit-actions"><button class="pill" type="submit">${editing>=0&&host===$('detail-editor')?'Guardar cambios':'Agregar al pedido'}</button>${host===$('cup-editor')?'<button class="pill outline" type="submit" value="checkout">Revisar y pedir por WhatsApp</button>':''}</div></form>`;
 const form=host.firstElementChild;
 function refresh(){
  for(const d of form.querySelectorAll('[data-key]')){
   const key=d.dataset.key,n=requirements[key],extra=cup&&key==='topping';
   d.querySelector('small').textContent=` · ${item.omitted.includes(key)?'Sin '+labels[key].toLowerCase():item[key].length?item[key].join(', '):'Pendiente'}`;
   for(const input of d.querySelectorAll(`input[name="${key}"]`))input.disabled=!(cup&&key==='sauce')&&!extra&&!input.checked&&item[key].length>=n;
  }
  form.querySelector('.extra-breakdown').textContent=surcharges(item).map(c=>`${c.label}: +${money(c.amount)} por vaso`).join(' · ');
  form.querySelector('output').textContent=item.qty+' · '+(price(item)===null?'Consultar precio':money(price(item)));
  form.querySelector('[data-step="-1"]').disabled=item.qty===1;
  form.querySelector('[data-step="1"]').disabled=item.qty>=99;
 }
 form.onclick=e=>{if(e.target.dataset.step){item.qty=Math.min(99,Math.max(1,item.qty+Number(e.target.dataset.step)));refresh();}};
 form.onchange=e=>{
  const field=e.target.name;form.querySelector('.warning').textContent='';
  if(field==='size'){item.id=e.target.value;if(host===$('cup-editor'))$('cup-photo').src=photo(find(item.id));else $('detail-name').textContent=find(item.id).name;editor(host,item);return;}
  if(field.startsWith('omit-')){
   const key=field.slice(5);item.omitted=item.omitted.filter(k=>k!==key);
   if(e.target.checked){item.omitted.push(key);item[key]=[];form.querySelectorAll(`input[name="${key}"]`).forEach(i=>i.checked=false);}
  }else if(field in labels){
   if(cup&&field==='sauce'&&e.target.checked)form.querySelectorAll('[name="sauce"]').forEach(input=>{input.checked=input===e.target;});
   item[field]=Array.from(form.querySelectorAll(`input[name="${field}"]:checked`),i=>i.value);
   if(item[field].length){item.omitted=item.omitted.filter(k=>k!==field);const omit=form.querySelector(`[name="omit-${field}"]`);if(omit)omit.checked=false;}
  }
  e.target.closest('[data-key]')?.classList.remove('selection-error');refresh();
 };
 form.oninput=e=>{if(e.target.name==='notes')item.notes=e.target.value;};
 form.onsubmit=e=>{
  e.preventDefault();
  const missing=ordered.filter(([k,n])=>n&&!item[k].length&&!item.omitted.includes(k));
  if(missing.length){
   for(const [k] of missing){const group=form.querySelector(`[data-key="${k}"]`);group.open=true;group.classList.add('selection-error');}
   form.querySelector('.warning').textContent='Antes de agregar el producto: '+missing.map(([k])=>(k==='topping'||k==='sauce')?`elige ${labels[k].toLowerCase()} o marca «${k==='sauce'?'Sin jalea':'Sin toppings'}»`:`elige al menos una ${k==='fruit'?'fruta':k==='sauce'?'jalea':'crema'}`).join('; ')+'.';
   form.querySelector(`[data-key="${missing[0][0]}"] summary`).focus();return;
  }
  if(host===$('detail-editor')&&editing>=0)basket[editing]=structuredClone(item);else basket.push(structuredClone(item));
  if($('detail').open)$('detail').close();editing=-1;resetCup();review();
 };refresh();
}
function resetCup(){const item=fresh('fresas-con-crema-grande');$('cup-photo').src=photo(find(item.id));editor($('cup-editor'),item);}
function detail(item,index=-1){editing=index;$('detail-name').textContent=find(item.id).name;editor($('detail-editor'),item);$('detail').showModal();}
rail.onclick=e=>{const card=e.target.closest('[data-id]');if(card)detail(fresh(card.dataset.id));};
function review(){
 const amounts=basket.map(price),partial=amounts.includes(null),sum=amounts.reduce((a,b)=>a+(b||0),0);
 const total=(partial?'Subtotal con precio confirmado':'Total')+' · '+money(sum);
 $('items').innerHTML=basket.map((it,i)=>`<article class="item"><strong>${it.qty} × ${esc(find(it.id).name)}</strong>${describe(it).map(t=>`<p>${esc(t)}</p>`).join('')}<p>${price(it)===null?'Consultar precio':money(price(it))}</p><button data-edit="${i}">Editar</button><button data-remove="${i}">Quitar</button></article>`).join('')+(basket.length?`<p><strong>${total}</strong></p>${partial?'<p>La tienda confirmará los precios pendientes.</p>':''}`:'<p>Elige un producto de la carta para comenzar.</p>');
 const text=['¡Hola, Sweet Yes! Quisiera pedir:',...basket.map(it=>[`${it.qty} × ${find(it.id).name}`, ...describe(it),price(it)===null?'Precio a consultar':money(price(it))].join('\n')),total,partial?'¿Me confirman los precios pendientes?':''].filter(Boolean).join('\n\n');
 $('send').href=`https://wa.me/${data.whatsapp}?text=${encodeURIComponent(text)}`;$('send').hidden=!basket.length;
 $('order-nav').textContent=basket.length?`Mi pedido (${basket.reduce((n,it)=>n+it.qty,0)})`:'Hacer pedido';
 if(!$('basket').open)$('basket').showModal();
}
$('items').onclick=e=>{const b=e.target;if(b.hasAttribute('data-remove')){basket.splice(Number(b.dataset.remove),1);review();}if(b.hasAttribute('data-edit')){$('basket').close();detail(structuredClone(basket[Number(b.dataset.edit)]),Number(b.dataset.edit));}};
$('order-nav').onclick=()=>basket.length?review():$('carta').scrollIntoView();
$('continue').onclick=()=>{$('basket').close();$('carta').scrollIntoView();};
document.querySelectorAll('dialog .close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('detail').onclose=()=>{editing=-1;};


const menuToggle=document.querySelector('.menu-toggle');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');}
menuToggle.onclick=()=>menuToggle.setAttribute('aria-expanded',menuToggle.getAttribute('aria-expanded')!=='true');
$('menu').onclick=closeMenu;
document.addEventListener('click',event=>{if(!event.target.closest('header'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuToggle.getAttribute('aria-expanded')==='true'){closeMenu();menuToggle.focus();}});
let scrollFrame = 0;
function stopScroll(){cancelAnimationFrame(scrollFrame);scrollFrame=0;}
for(const eventName of ['wheel','touchstart','pointerdown','keydown']){
  window.addEventListener(eventName,stopScroll,{passive:true});
}
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
  const target=document.getElementById(link.hash.slice(1));
  if(!target)return;
  event.preventDefault();closeMenu();stopScroll();
  if(target.tagName==='DETAILS')target.open=true;
  if(location.hash!==link.hash)history.pushState(null,'',link.hash);
  const start=window.scrollY;
  const end=Math.max(0,Math.min(start+target.getBoundingClientRect().top-14,document.documentElement.scrollHeight-innerHeight));
  const duration=reduced.matches?0:Math.min(1050,480+Math.abs(end-start)*.2);
  const time=performance.now();
  function step(now){
    const t=duration?Math.min(1,(now-time)/duration):1;
    const ease=t*t*(3-2*t);
    window.scrollTo({top:start+(end-start)*ease,behavior:'instant'});
    if(t<1){scrollFrame=requestAnimationFrame(step);return;}
    target.setAttribute('tabindex','-1');target.focus({preventScroll:true});scrollFrame=0;
  }
  scrollFrame=requestAnimationFrame(step);
});
const headings=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){
    entry.target.classList.add('heading-arrive');headings.unobserve(entry.target);
  }
},{threshold:.3});
document.querySelectorAll('main h2').forEach(title=>headings.observe(title));
const stats=document.querySelector('.shop-stats');
const counters=stats.querySelectorAll('[data-count]');
let countFrame=0,statsVisible=false;
const countObserver=new IntersectionObserver(entries=>{
 const visible=entries.some(entry=>entry.isIntersecting);
 if(!visible){statsVisible=false;cancelAnimationFrame(countFrame);return;}
 if(statsVisible)return;
 statsVisible=true;
 const start=performance.now();
 function tick(now){
  const progress=reduced.matches?1:Math.min(1,(now-start)/1600);
  const ease=1-(1-progress)**2;
  for(const counter of counters){
   const value=1+Math.floor((Number(counter.dataset.count)-1)*ease);
   counter.textContent=String(value).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
  }
  if(progress<1)countFrame=requestAnimationFrame(tick);
 }
 tick(start);
},{threshold:.55});
countObserver.observe(stats);

const quoteRail=document.querySelector('.quotes');
const [previousReview,nextReview]=document.querySelectorAll('.review-controls button');
function updateReviewControls(){
  previousReview.disabled=quoteRail.scrollLeft<2;
  nextReview.disabled=quoteRail.scrollLeft+quoteRail.clientWidth>=quoteRail.scrollWidth-2;
}
function moveReview(direction){
  const step=quoteRail.children[1].offsetLeft-quoteRail.children[0].offsetLeft;
  quoteRail.scrollBy({left:direction*step,behavior:reduced.matches?'instant':'smooth'});
}
previousReview.onclick=()=>moveReview(-1);
nextReview.onclick=()=>moveReview(1);
quoteRail.addEventListener('scroll',updateReviewControls,{passive:true});
new ResizeObserver(updateReviewControls).observe(quoteRail);
const filmRail=document.querySelector('.film-grid');
const films=Array.from(filmRail.children);
const [prevFilm,nextFilm]=document.querySelectorAll('.film-controls button');
let activeFilm=0;
function goToFilm(index){
  filmRail.scrollTo({left:filmRail.clientWidth*index,behavior:reduced.matches?'instant':'smooth'});
}
function syncFilm(){
  const index=Math.round(filmRail.scrollLeft/filmRail.clientWidth);
  if(!films[index])return;
  activeFilm=index;
  films.forEach((film,i)=>{
    film.inert=i!==index;
    if(film.inert)film.querySelector('video')?.pause();
  });
  prevFilm.disabled=index===0;nextFilm.disabled=index===films.length-1;
  document.querySelector('.film-controls output').textContent=(index+1)+' de '+films.length;
}
new ResizeObserver(()=>{filmRail.scrollTo({left:filmRail.clientWidth*activeFilm,behavior:'instant'});syncFilm();}).observe(filmRail);
prevFilm.onclick=()=>goToFilm(activeFilm-1);
nextFilm.onclick=()=>goToFilm(activeFilm+1);
filmRail.addEventListener('scroll',syncFilm,{passive:true});
filmRail.onkeydown=event=>{
  if(event.target!==filmRail)return;
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
    event.preventDefault();goToFilm(Math.max(0,Math.min(films.length-1,activeFilm+(event.key==='ArrowRight'?1:-1))));
  }
};
for(const button of document.querySelectorAll('.film-poster')){
  button.addEventListener('click',()=>{
    const video=document.createElement('video');
    video.controls=true;
    video.preload='metadata';
    video.playsInline=true;
    video.setAttribute('aria-label',button.closest('article').getAttribute('aria-label'));
    video.poster=button.querySelector('img').src;
    video.src='assets/recorrido/'+button.dataset.film+'-web.mp4';
    video.addEventListener('play',()=>{
      document.querySelectorAll('.film-grid video').forEach(other=>{if(other!==video)other.pause();});
    });
    button.replaceWith(video);
    video.focus();
    video.play().catch(()=>{/* Native play controls remain available. */});
  });
}
renderCatalog();resetCup();
})();









