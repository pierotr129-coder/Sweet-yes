/* Presentation layer only: app.js remains the source of pricing and order rules. */
(()=>{
 const root=document.querySelector('#vaso'),game=document.querySelector('#cup-game'),host=document.querySelector('#cup-editor');
 const names=['Tamaño','Jalea','Frutas','Cremas','Toppings','Tu pedido'];
 const keys=['sauce','fruit','cream','topping'];let step=0;
 const start=root.querySelector('.game-start'),invite=root.querySelector('.game-invite');
 const nav=root.querySelector('.game-stages');
 nav.innerHTML=names.map((n,i)=>`<button type="button" data-stage="${i}"><span>${String(i+1).padStart(2,'0')}</span>${n}</button>`).join('');
 function draw(focus=false){
  const form=host.querySelector('form');if(!form)return;
  form.classList.add('game-form');
  form.querySelector('.size-options').hidden=step!==0;
  form.querySelectorAll('details[data-key]').forEach(d=>{d.hidden=keys.indexOf(d.dataset.key)!==step-1;d.open=!d.hidden;});
  const notes=form.querySelector('details:not([data-key])');notes.hidden=step!==5;
  form.querySelector('.edit-actions').hidden=step!==5;
  form.querySelector('.included-info').hidden=step!==0;
  let recap=form.querySelector('.game-recap');
  if(!recap){recap=document.createElement('div');recap.className='game-recap';form.querySelector('.included-info').after(recap);}
  recap.hidden=step!==5;
  if(step===5){recap.replaceChildren();keys.forEach((key,i)=>{const row=document.createElement('p');const label=document.createElement('strong');label.textContent=names[i+1]+': ';row.append(label,form.querySelector(`[data-key="${key}"] summary small`).textContent.replace(/^\s*·\s*/,''));recap.append(row);});}
  root.querySelector('.game-count').textContent=`Paso ${step+1} de 6 · ${names[step]}`;
  nav.querySelectorAll('button').forEach((b,i)=>{b.setAttribute('aria-current',i===step?'step':'false');b.disabled=i>step;});
  const current=nav.children[step];nav.scrollLeft=Math.max(0,current.offsetLeft-nav.offsetLeft-nav.clientWidth/2+current.clientWidth/2);
  root.querySelector('.game-prev').hidden=step===0;
  root.querySelector('.game-next').hidden=step===5;
  if(focus){const target=step===0?form.querySelector('input[name=size]:checked'):step<5?form.querySelector(`details[data-key="${keys[step-1]}"] summary`):notes.querySelector('summary');target?.focus({preventScroll:true});}
 }
 function ready(){
  if(step===0||step===5)return true;
  const form=host.querySelector('form'),key=keys[step-1],group=form.querySelector(`[data-key="${key}"]`);
  if(group.classList.contains('step-complete'))return true;
  form.querySelector('.warning').textContent=key==='sauce'?'Elige una jalea o marca «Sin jalea» para continuar.':key==='topping'?'Elige tus toppings o marca «Sin toppings» para continuar.':`Elige al menos una ${key==='fruit'?'fruta':'crema'} para continuar.`;
  group.querySelector('summary').focus();return false;
 }
 start.onclick=()=>{invite.hidden=true;game.hidden=false;start.setAttribute('aria-expanded','true');draw(true);};
 root.querySelector('.game-back-home').onclick=()=>{game.hidden=true;invite.hidden=false;start.setAttribute('aria-expanded','false');start.focus();};
 root.querySelector('.game-next').onclick=()=>{if(ready()){step=Math.min(5,step+1);host.querySelector('.warning').textContent='';draw(true);}};
 root.querySelector('.game-prev').onclick=()=>{step=Math.max(0,step-1);draw(true);};
 nav.onclick=e=>{const b=e.target.closest('button');if(b&&!b.disabled){step=Number(b.dataset.stage);draw(true);}};
 new MutationObserver(()=>draw()).observe(host,{childList:true});
 host.addEventListener('submit',()=>{queueMicrotask(()=>{const missing=host.querySelector('.selection-error');if(missing)step=keys.indexOf(missing.dataset.key)+1;else step=0;draw();});});
 draw();
})();
