/* Timed play is separate from the order: losing never removes a selection. */
(()=>{
 const root=document.querySelector('#vaso'),game=root.querySelector('#cup-game'),host=root.querySelector('#cup-editor'),scene=root.querySelector('.sweet-runner'),count=root.querySelector('.game-count');
 const bar=document.createElement('div');bar.className='challenge-bar';
 bar.innerHTML='<div class="challenge-line"><strong class="challenge-level"></strong><span class="challenge-time" role="timer"></span></div><div class="challenge-meter"><i></i></div><p class="challenge-help">Elige antes de que se acabe el tiempo y salva a la fresita.</p><div class="challenge-failure" hidden><strong role="alert">¡Oh, no! La fresita tropezó.</strong><p>Se acabó el tiempo. Tu vaso sigue guardado.</p><button type="button" class="challenge-retry">Reintentar este nivel</button></div><button type="button" class="challenge-mode">Jugar sin tiempo</button>';
 host.before(bar);
 const labels=['Pradera de vainilla','Camino de caramelo','Atardecer de fresa','Bosque de chocolate','Noche de chispitas','¡Llegaste a la meta!'];
 const durations=[30,25,25,22,22,0],keys=['','sauce','fruit','cream','topping'];
 let level=-1,remaining=30,timed=true,lost=false,chosen=false,onscreen=false,last=performance.now(),announced=false;
 new IntersectionObserver(entries=>{onscreen=entries[0].isIntersecting;last=performance.now();},{threshold:0}).observe(game);
 function choiceReady(){return level>0&&level<5&&host.querySelector(`[data-key="${keys[level]}"]`)?.classList.contains('step-complete');}
 function unlock(){host.inert=false;root.querySelector('.game-navigation').inert=false;lost=false;scene.classList.remove('runner-lost');bar.querySelector('.challenge-failure').hidden=true;scene.dispatchEvent(new Event('challenge-resume'));}
 function update(){
  bar.querySelector('.challenge-level').textContent=`${level<5?'Nivel '+(level+1)+' · ':''}${labels[level]}`;
  bar.querySelector('.challenge-time').textContent=level===5?'✓':!timed?'Sin tiempo':chosen?'¡A salvo!':`${Math.ceil(remaining)} s`;
  bar.querySelector('.challenge-meter i').style.width=(level===5||!timed||chosen?100:remaining/durations[level]*100)+'%';
  bar.classList.toggle('challenge-urgent',timed&&!chosen&&remaining<=8&&level<5);
  if(!timed)scene.querySelector('.runner-message').textContent='Aventura sin tiempo · Disfruta a tu ritmo';
  else if(chosen)scene.querySelector('.runner-message').textContent='¡A salvo! Sigue al próximo nivel cuando quieras.';
  else if(level===5)scene.querySelector('.runner-message').textContent='¡Completaste la aventura!';
  bar.querySelector('.challenge-help').textContent=level===5?'Revisa tu combinación y agrégala al pedido.':chosen?'¡Salvaste a la fresita! Puedes ajustar tus opciones y continuar.':timed?'Elige antes de que se acabe el tiempo y salva a la fresita.':'Disfruta la aventura a tu ritmo.';
 }
 function sync(){const next=Number((count.textContent.match(/Paso (\d)/)||[])[1]||1)-1;if(next===level)return;level=next;unlock();remaining=durations[level];chosen=!!choiceReady();announced=false;scene.dataset.level=String(level);scene.classList.toggle('runner-victory',level===5);last=performance.now();update();}
 new MutationObserver(sync).observe(count,{childList:true,characterData:true,subtree:true});
 host.addEventListener('change',()=>queueMicrotask(()=>{if(lost)return;chosen=level===0||!!choiceReady();update();}));
 bar.querySelector('.challenge-retry').onclick=()=>{unlock();remaining=durations[level];chosen=!!choiceReady();announced=false;last=performance.now();update();host.querySelector('input:not([type=hidden])')?.focus({preventScroll:true});};
 bar.querySelector('.challenge-mode').onclick=()=>{timed=!timed;unlock();remaining=durations[level];chosen=!!choiceReady();last=performance.now();bar.querySelector('.challenge-mode').textContent=timed?'Jugar sin tiempo':'Activar reto con tiempo';update();};
 setInterval(()=>{const now=performance.now(),dt=(now-last)/1000;last=now;if(game.hidden||document.hidden||!onscreen||!timed||lost||chosen||level===5||scene.classList.contains('runner-paused'))return;
  remaining=Math.max(0,remaining-Math.min(dt,1));update();
  if(remaining<=8&&!announced){announced=true;scene.querySelector('.runner-message').textContent='¡Rápido! Elige para salvar a la fresita.';}
  if(remaining===0){lost=true;scene.classList.add('runner-lost');host.inert=true;root.querySelector('.game-navigation').inert=true;bar.querySelector('.challenge-failure').hidden=false;scene.querySelector('.runner-message').textContent='Fin de la partida · Puedes reintentar';bar.querySelector('.challenge-retry').focus({preventScroll:true});}
 },100);
 document.addEventListener('visibilitychange',()=>{last=performance.now();});
 sync();
})();
