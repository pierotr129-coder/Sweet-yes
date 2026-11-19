/* Reto con tiempo: separado del pedido; perder nunca borra una selección.
   Mientras corre el tiempo, la cocinera se acerca a la fresita (data-chase de 0 a 1). */
(()=>{
 const root=document.querySelector('#vaso'),game=root.querySelector('#cup-game'),host=root.querySelector('#cup-editor'),scene=root.querySelector('.sweet-runner'),count=root.querySelector('.game-count');
 const $=s=>scene.querySelector(s),say=(t,o)=>scene.sweetSay?.(t,o);
 const asks=['¡Elige tu tamaño!','¡Elige tu jalea!','¡Elige tus frutas!','¡Elige tus cremas!','¡Elige tus toppings!','¡Tu vaso está listo!'];
 const durations=[30,25,25,22,22,0],keys=['','sauce','fruit','cream','topping'];
 let level=-1,remaining=30,timed=true,lost=false,chosen=false,onscreen=false,last=performance.now(),announced=false;
 new IntersectionObserver(entries=>{onscreen=entries[0].isIntersecting;last=performance.now();},{threshold:0}).observe(game);
 function choiceReady(){return level>0&&level<5&&host.querySelector(`[data-key="${keys[level]}"]`)?.classList.contains('step-complete');}
 function unlock(){host.inert=false;root.querySelector('.game-navigation').inert=false;lost=false;scene.classList.remove('runner-lost');$('.runner-over').hidden=true;scene.dispatchEvent(new Event('challenge-resume'));}
 function update(){
  $('.hud-level').textContent=level===5?'¡Meta!':`Nivel ${level+1}`;
  $('.hud-time b').textContent=level===5||chosen?'✓':!timed?'∞':Math.ceil(remaining);
  $('.runner-meter i').style.width=(level===5||!timed||chosen?100:remaining/durations[level]*100)+'%';
  scene.classList.toggle('runner-urgent',timed&&!chosen&&!lost&&remaining<=8&&level<5);
  scene.dataset.chase=String(!timed||chosen||level===5?0:Math.min(1,Math.max(0,1-remaining/durations[level])));
 }
 function sync(){const next=Number((count.textContent.match(/Paso (\d)/)||[])[1]||1)-1;if(next===level)return;level=next;unlock();remaining=durations[level];chosen=!!choiceReady();announced=false;scene.dataset.level=String(level);scene.classList.toggle('runner-victory',level===5);last=performance.now();update();if(!game.hidden)say(asks[level],{hold:level===5});}
 new MutationObserver(sync).observe(count,{childList:true,characterData:true,subtree:true});
 host.addEventListener('change',()=>queueMicrotask(()=>{
  if(lost)return;const was=chosen;chosen=level===0||!!choiceReady();update();
  if(chosen&&!was&&timed&&level<5){scene.dataset.saved='1';say('¡A salvo! Toca Continuar');setTimeout(()=>delete scene.dataset.saved,700);}
 }));
 $('.over-retry').onclick=()=>{unlock();remaining=durations[level];chosen=!!choiceReady();announced=false;last=performance.now();update();say(asks[level]);$('.runner-world').focus({preventScroll:true});};
 $('.runner-mode').onclick=()=>{timed=!timed;const b=$('.runner-mode');b.setAttribute('aria-pressed',String(!timed));b.setAttribute('aria-label',timed?'Jugar sin tiempo':'Activar reto con tiempo');b.title=b.getAttribute('aria-label');b.textContent=timed?'∞':'⏱';unlock();remaining=durations[level];chosen=!!choiceReady();last=performance.now();update();say(timed?'¡Reto con tiempo!':'Sin prisa ♥');};
 setInterval(()=>{const now=performance.now(),dt=(now-last)/1000;last=now;if(game.hidden||document.hidden||!onscreen||!timed||lost||chosen||level===5||scene.classList.contains('runner-paused'))return;
  remaining=Math.max(0,remaining-Math.min(dt,1));update();
  if(remaining<=8&&!announced){announced=true;say('¡Rápido! ¡Se acaba el tiempo!',{hold:true});}
  if(remaining===0){lost=true;update();scene.classList.add('runner-lost');host.inert=true;root.querySelector('.game-navigation').inert=true;$('.runner-over').hidden=false;say('');scene.dispatchEvent(new Event('challenge-resume'));$('.over-retry').focus({preventScroll:true});}
 },100);
 document.addEventListener('visibilitychange',()=>{last=performance.now();});
 sync();
})();
