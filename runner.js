/* Decorative runner: never changes cart values, prices or selections.
   Mecánica: la fresita recorre el camino y salta para atrapar antojos (fresas, corazones, chispitas). */
(()=>{
 const root=document.querySelector('#vaso'),invite=root.querySelector('.game-invite'),game=root.querySelector('#cup-game');
 /* La invitación es solo la pantalla de inicio: el juego aparece al pulsar "Empezar". */
 const startButton=root.querySelector('.game-start');
 invite.querySelector('.invite-stage')?.addEventListener('click',()=>startButton.click());
 const art={
  berry:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 9.5c6.2 0 10 3.2 10 8 0 6-6 11.5-10 11.5S6 23.5 6 17.5c0-4.8 3.8-8 10-8Z" fill="#d84a63"/><path d="M16 11c-2.6-4-6.7-4.4-8-2.3 3.1 0 5.3.9 8 2.3 2.7-1.4 4.9-2.3 8-2.3-1.3-2.1-5.4-1.7-8 2.3Z" fill="#6e9a59"/><g fill="#ffe2b4"><circle cx="12" cy="16" r=".9"/><circle cx="19.5" cy="15.5" r=".9"/><circle cx="15.5" cy="20" r=".9"/><circle cx="21" cy="20.5" r=".9"/><circle cx="11" cy="21.5" r=".9"/><circle cx="17" cy="25" r=".9"/></g></svg>',
  heart:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27.5S4.5 20.6 4.5 12.6A5.8 5.8 0 0 1 16 10a5.8 5.8 0 0 1 11.5 2.6C27.5 20.6 16 27.5 16 27.5Z" fill="#e98fae"/><path d="M9.5 12.5a3 3 0 0 1 3-2.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".7"/></svg>',
  spark:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3l2.6 10.4L29 16l-10.4 2.6L16 29l-2.6-10.4L3 16l10.4-2.6Z" fill="#d9a441"/></svg>'
 };
 const scene=document.createElement('div');scene.className='sweet-runner';
 scene.innerHTML=`<div class="runner-hud"><span>SWEET YES · AVENTURA DE SABOR</span><span class="runner-hud-right"><span class="runner-score" title="Antojos atrapados">${art.heart}<b>0</b></span><button type="button" class="runner-motion" aria-pressed="false" aria-label="Pausar animación">Ⅱ</button></span></div><div class="runner-world" aria-hidden="true"><div class="runner-cloud cloud-one"></div><div class="runner-cloud cloud-two"></div><div class="runner-hills"></div><div class="runner-trail"></div><div class="runner-shadow"></div><div class="runner-character"><img src="assets/marca/fresita-runner.webp" width="140" height="140" alt=""></div><div class="runner-items"></div><div class="runner-ground"></div></div><div class="runner-footer"><span class="runner-message">Toca el camino o el botón para saltar y atrapar antojos.</span><button type="button" class="runner-jump">Saltar ↑</button></div>`;
 game.querySelector('.game-top').after(scene);scene.classList.add('runner-playing');
 const $=s=>scene.querySelector(s);
 const character=$('.runner-character'),shadow=$('.runner-shadow'),world=$('.runner-world'),layer=$('.runner-items'),message=$('.runner-message'),score=$('.runner-score'),scoreValue=score.querySelector('b');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches,visible=false,frame=0,last=0,time=0,jumpAt=0,spawnIn=900,caught=0,items=[],rewardTimer,geo=null;
 const JUMP=720;
 function measure(){const cs=getComputedStyle(character);geo={w:world.clientWidth,h:world.clientHeight,base:parseFloat(cs.bottom)||21,ch:character.offsetHeight,cx:world.clientWidth*.23,size:layer.firstElementChild?.offsetWidth||(innerWidth<=700?24:30)};geo.maxH=Math.min(95,geo.h*.42);}
 function motion(){scene.classList.toggle('runner-paused',paused);const b=$('.runner-motion');b.textContent=paused?'▶':'Ⅱ';b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',paused?'Reanudar animación':'Pausar animación');}
 function lift(now){if(!jumpAt)return 0;const t=(now-jumpAt)/JUMP;if(t>=1){jumpAt=0;return 0;}return Math.sin(t*Math.PI);}
 function jump(){if(scene.classList.contains('runner-lost'))return;const now=performance.now();if(!jumpAt||now-jumpAt>JUMP*.55)jumpAt=now;resume();}
 function spawn(kind){
  if(!geo)measure();
  const high=kind?true:Math.random()<.55,type=kind||(high?(Math.random()<.5?'heart':'spark'):'berry');
  const el=document.createElement('div');el.className='runner-item'+(high?' is-high':'');el.innerHTML=art[type];layer.append(el);
  const y=high?geo.base+geo.ch*.75+geo.maxH*.45:geo.base+geo.ch*.22;
  items.push({el,x:geo.w+20,y,high,done:false});
 }
 function collect(item){
  item.done=true;item.el.classList.add('caught');setTimeout(()=>item.el.remove(),380);
  caught++;scoreValue.textContent=caught;score.classList.remove('bump');void score.offsetWidth;score.classList.add('bump');setTimeout(()=>score.classList.remove('bump'),200);
  const pop=document.createElement('span');pop.className='runner-pop';pop.textContent=item.high?'+2':'+1';pop.style.left=(geo.cx+10)+'px';pop.style.bottom=(item.y+18)+'px';world.append(pop);setTimeout(()=>pop.remove(),820);
  if(item.high){caught++;scoreValue.textContent=caught;}
  if(caught%10<(item.high?2:1)&&caught>=10&&!scene.classList.contains('runner-lost'))message.textContent=`¡${caught} antojos! Qué dulce vas.`;
 }
 function tick(now){
  frame=0;
  if(!visible||document.hidden||paused||scene.classList.contains('runner-lost')){last=0;return;}
  if(!geo)measure();
  const dt=last?Math.min(40,now-last):0;last=now;time+=dt;
  const level=Number(scene.dataset.level||0),speed=geo.w/2700*(1+level*.12);
  spawnIn-=dt;if(spawnIn<=0){spawn();spawnIn=1250-level*80+Math.random()*650;}
  const up=lift(now),offset=up*geo.maxH,bounce=up?0:Math.abs(Math.sin(time/95))*4;
  character.style.transform=`translateY(${-offset-bounce}px) rotate(${up?-8:Math.sin(time/95)*4}deg)`;
  shadow.style.transform=`scale(${1-up*.4})`;shadow.style.opacity=String(.18-up*.09);
  const bottom=geo.base+offset,top=bottom+geo.ch*.88,half=geo.size/2;
  items=items.filter(item=>{
   if(item.done)return false;
   item.x-=speed*dt;
   item.el.style.transform=`translate3d(${item.x-half}px,${-item.y+half}px,0)`;
   const cy=item.y;
   if(Math.abs(item.x-geo.cx)<geo.ch*.32&&cy>bottom+geo.ch*.1&&cy<top){collect(item);return false;}
   if(item.x<-40){item.el.remove();return false;}
   return true;
  });
  frame=requestAnimationFrame(tick);
 }
 function resume(){if(!frame&&visible&&!document.hidden&&!paused)frame=requestAnimationFrame(tick);}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{threshold:0}).observe(scene);
 new ResizeObserver(()=>{geo=null;}).observe(world);
 document.addEventListener('visibilitychange',resume);
 $('.runner-motion').onclick=()=>{paused=!paused;motion();resume();};
 reduced.addEventListener('change',()=>{paused=reduced.matches;motion();resume();});
 $('.runner-jump').onclick=()=>{jump();if(!reduced.matches&&!scene.classList.contains('runner-lost')&&caught===0)message.textContent='¡Arriba! Los corazones y chispitas valen doble.';};
 world.addEventListener('pointerdown',e=>{e.preventDefault();jump();});
 startButton.addEventListener('click',()=>{geo=null;message.textContent='Elige tu tamaño. ¡La aventura comienza!';requestAnimationFrame(()=>root.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'}));resume();});
 root.querySelector('.game-back-home').addEventListener('click',()=>{geo=null;requestAnimationFrame(()=>root.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'}));});
 root.querySelector('#cup-editor').addEventListener('change',e=>{if(!e.target.matches('input'))return;requestAnimationFrame(()=>{if(root.querySelector('.warning').textContent)return;jump();spawn('spark');scene.classList.remove('runner-reward');void scene.offsetWidth;scene.classList.add('runner-reward');message.textContent='¡Una elección más para tu vaso! Atrapa la chispita.';clearTimeout(rewardTimer);rewardTimer=setTimeout(()=>scene.classList.remove('runner-reward'),900);});});
 root.querySelector('.game-next').addEventListener('click',()=>{if(!root.querySelector('.warning').textContent)message.textContent=root.querySelector('.game-count').textContent+' · ¡Sigamos!';});
 scene.addEventListener('challenge-resume',resume);
 motion();resume();
})();
