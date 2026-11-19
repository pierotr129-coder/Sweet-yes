/* Minijuego decorativo: nunca cambia precios, pedidos ni selecciones.
   La fresita corre, salta (tocando el escenario) para atrapar antojos y escapa de la cocinera. */
(()=>{
 const root=document.querySelector('#vaso'),invite=root.querySelector('.game-invite'),game=root.querySelector('#cup-game');
 const startButton=root.querySelector('.game-start');
 invite.querySelector('.invite-buddy')?.addEventListener('click',()=>startButton.click());
 const art={
  berry:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 9.5c6.2 0 10 3.2 10 8 0 6-6 11.5-10 11.5S6 23.5 6 17.5c0-4.8 3.8-8 10-8Z" fill="#d84a63"/><path d="M16 11c-2.6-4-6.7-4.4-8-2.3 3.1 0 5.3.9 8 2.3 2.7-1.4 4.9-2.3 8-2.3-1.3-2.1-5.4-1.7-8 2.3Z" fill="#6e9a59"/><g fill="#ffe2b4"><circle cx="12" cy="16" r=".9"/><circle cx="19.5" cy="15.5" r=".9"/><circle cx="15.5" cy="20" r=".9"/><circle cx="21" cy="20.5" r=".9"/><circle cx="11" cy="21.5" r=".9"/><circle cx="17" cy="25" r=".9"/></g></svg>',
  heart:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27.5S4.5 20.6 4.5 12.6A5.8 5.8 0 0 1 16 10a5.8 5.8 0 0 1 11.5 2.6C27.5 20.6 16 27.5 16 27.5Z" fill="#e98fae"/><path d="M9.5 12.5a3 3 0 0 1 3-2.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".7"/></svg>',
  spark:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3l2.6 10.4L29 16l-10.4 2.6L16 29l-2.6-10.4L3 16l10.4-2.6Z" fill="#d9a441"/></svg>',
  clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 9v4l2.5 2M9.5 3h5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
 };
 /* La cocinera de Sweet Yes: gorro rosado, mandil y un vaso vacío listo para la fresita. */
 const chef='<svg viewBox="0 0 120 170" aria-hidden="true"><g class="chef-speed" fill="none" stroke="#c98a9c" stroke-width="3" stroke-linecap="round" opacity=".55"><path d="M4 88h16M0 102h18M6 116h12"/></g><g class="chef-run"><g class="leg-b"><path d="M56 120L46 150" stroke="#3b1d16" stroke-width="7" stroke-linecap="round"/><ellipse cx="42" cy="153" rx="11" ry="5.5" fill="#3b1d16"/></g><g class="leg-f"><path d="M66 120L80 148" stroke="#3b1d16" stroke-width="7" stroke-linecap="round"/><ellipse cx="85" cy="151" rx="11" ry="5.5" fill="#3b1d16"/></g><path d="M46 90Q34 100 32 114" fill="none" stroke="#3b1d16" stroke-width="10" stroke-linecap="round"/><path d="M46 90Q34 100 32 114" fill="none" stroke="#f0c19c" stroke-width="5.5" stroke-linecap="round"/><path d="M42 82Q61 72 82 82L90 126Q62 134 34 126Z" fill="#fff6ee" stroke="#3b1d16" stroke-width="3.5" stroke-linejoin="round"/><path d="M48 94Q62 90 76 94L80 126Q62 130 44 126Z" fill="#ef8fb0" stroke="#3b1d16" stroke-width="3" stroke-linejoin="round"/><path d="M58 106c0-3 4-3 4 0 0-3 4-3 4 0 0 3-4 5-4 5s-4-2-4-5Z" fill="#fff"/><path d="M76 90Q92 96 102 84" fill="none" stroke="#3b1d16" stroke-width="10" stroke-linecap="round"/><path d="M76 90Q92 96 102 84" fill="none" stroke="#f0c19c" stroke-width="5.5" stroke-linecap="round"/><path d="M95 62h18l-2.8 20h-12.4Z" fill="#fff" stroke="#3b1d16" stroke-width="3" stroke-linejoin="round"/><path d="M96.5 68h15" stroke="#ef8fb0" stroke-width="2.5"/><circle cx="103" cy="84" r="5" fill="#f0c19c" stroke="#3b1d16" stroke-width="2.5"/><rect x="55" y="64" width="10" height="12" fill="#f0c19c"/><circle cx="60" cy="52" r="18" fill="#f0c19c" stroke="#3b1d16" stroke-width="3.5"/><circle cx="42" cy="55" r="7.5" fill="#4a2a20" stroke="#3b1d16" stroke-width="3"/><path d="M43 50Q44 36 60 34Q74 34 78 46Q66 40 54 44Q48 46 43 50Z" fill="#4a2a20"/><path d="M39 45Q33 24 54 24Q60 13 71 21Q88 21 81 45Q60 37 39 45Z" fill="#f3a3bd" stroke="#3b1d16" stroke-width="3.5" stroke-linejoin="round"/><circle cx="67" cy="52" r="2.4" fill="#3b1d16"/><circle cx="75.5" cy="52" r="2.4" fill="#3b1d16"/><path d="M65 59Q71 68 78 58Z" fill="#4a1a1f" stroke="#3b1d16" stroke-width="2" stroke-linejoin="round"/><ellipse cx="62" cy="58.5" rx="4" ry="2.5" fill="#f2668f" opacity=".45"/></g></svg>';
 const scene=document.createElement('div');scene.className='sweet-runner runner-playing';
 scene.innerHTML=`<div class="runner-world" tabindex="0" aria-label="Escenario del minijuego. Toca o pulsa espacio para saltar.">
  <div class="runner-sky" aria-hidden="true"><div class="runner-cloud cloud-one"></div><div class="runner-cloud cloud-two"></div><div class="runner-hills"></div></div>
  <div class="game-hud"><span class="hud-pill hud-level">Nivel 1</span><span class="hud-right"><span class="hud-pill hud-time" role="timer">${art.clock}<b>30</b></span><span class="hud-pill hud-score" title="Antojos atrapados">${art.heart}<b>0</b></span><button type="button" class="hud-btn runner-mode" aria-pressed="false" aria-label="Jugar sin tiempo" title="Jugar sin tiempo">∞</button><button type="button" class="hud-btn hud-pause" aria-pressed="false" aria-label="Pausar">Ⅱ</button></span></div>
  <div class="runner-meter" aria-hidden="true"><i></i></div>
  <div class="runner-chef" aria-hidden="true">${chef}</div>
  <div class="runner-shadow" aria-hidden="true"></div>
  <div class="runner-character" aria-hidden="true"><img src="assets/marca/fresita-runner.webp" width="140" height="140" alt=""></div>
  <span class="runner-bubble" aria-live="polite"></span>
  <div class="runner-items" aria-hidden="true"></div>
  <div class="runner-ground" aria-hidden="true"></div>
  <div class="runner-over" hidden><strong class="over-title">¡Ups!</strong><span class="over-sub">¡La cocinera te alcanzó!</span><button type="button" class="over-retry">Otra vez ↻</button></div>
 </div>`;
 game.querySelector('.game-top').after(scene);
 const $=s=>scene.querySelector(s);
 const character=$('.runner-character'),shadow=$('.runner-shadow'),world=$('.runner-world'),layer=$('.runner-items'),bubble=$('.runner-bubble'),chefEl=$('.runner-chef'),score=$('.hud-score'),scoreValue=score.querySelector('b');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches,visible=false,frame=0,last=0,time=0,jumpAt=0,spawnIn=900,caught=0,items=[],rewardTimer,bubbleTimer,geo=null,chase=0,jumped=false;
 const JUMP=720;
 function measure(){const cs=getComputedStyle(character);geo={w:world.clientWidth,h:world.clientHeight,base:parseFloat(cs.bottom)||21,ch:character.offsetHeight,cx:character.offsetLeft+character.offsetWidth/2,size:innerWidth<=700?26:32,chefW:chefEl.offsetWidth};geo.maxH=Math.min(110,geo.h*.4);}
 /* Globo de diálogo de la fresita: frases cortas, estilo minijuego. */
 function say(text,{hold=false}={}){
  clearTimeout(bubbleTimer);
  if(!text){bubble.classList.add('bubble-hide');return;}
  bubble.textContent=text;bubble.classList.remove('bubble-hide','bubble-pop');void bubble.offsetWidth;bubble.classList.add('bubble-pop');
  if(!hold)bubbleTimer=setTimeout(()=>bubble.classList.add('bubble-hide'),2600);
 }
 scene.sweetSay=say;
 function motion(){scene.classList.toggle('runner-paused',paused);const b=$('.hud-pause');b.textContent=paused?'▶':'Ⅱ';b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',paused?'Reanudar':'Pausar');}
 function lift(now){if(!jumpAt)return 0;const t=(now-jumpAt)/JUMP;if(t>=1){jumpAt=0;return 0;}return Math.sin(t*Math.PI);}
 function jump(){
  if(scene.classList.contains('runner-lost'))return;
  const now=performance.now();if(!jumpAt||now-jumpAt>JUMP*.55)jumpAt=now;
  if(!jumped){jumped=true;say('¡Así! Atrapa los corazones');}
  resume();
 }
 function spawn(kind){
  if(!geo)measure();
  const high=kind?true:Math.random()<.55,type=kind||(high?(Math.random()<.5?'heart':'spark'):'berry');
  const el=document.createElement('div');el.className='runner-item'+(high?' is-high':'');el.innerHTML=art[type];layer.append(el);
  const y=high?geo.base+geo.ch*.75+geo.maxH*.45:geo.base+geo.ch*.22;
  items.push({el,x:geo.w+20,y,high,done:false});
 }
 function collect(item){
  item.done=true;item.el.classList.add('caught');setTimeout(()=>item.el.remove(),380);
  const before=caught;caught+=item.high?2:1;scoreValue.textContent=caught;
  score.classList.remove('bump');void score.offsetWidth;score.classList.add('bump');
  const pop=document.createElement('span');pop.className='runner-pop';pop.textContent=item.high?'+2':'+1';pop.style.left=(geo.cx+10)+'px';pop.style.bottom=(item.y+18)+'px';world.append(pop);setTimeout(()=>pop.remove(),820);
  if(Math.floor(caught/10)>Math.floor(before/10))say(`¡${Math.floor(caught/10)*10} antojos!`);
 }
 function placeChef(target,dt){
  chase+=(target-chase)*Math.min(1,dt/350);
  const far=geo.cx-geo.w*.4-geo.chefW/2,near=geo.cx-geo.chefW*.85;
  chefEl.style.transform=`translateX(${far+(near-far)*chase}px)`;
 }
 function tick(now){
  frame=0;
  if(!visible||document.hidden||paused){last=0;return;}
  if(!geo)measure();
  if(scene.classList.contains('runner-lost')){placeChef(1,1000);last=0;return;}
  const dt=last?Math.min(40,now-last):0;last=now;time+=dt;
  const level=Number(scene.dataset.level||0),speed=geo.w/2700*(1+level*.12);
  spawnIn-=dt;if(spawnIn<=0){spawn();spawnIn=1250-level*80+Math.random()*650;}
  const up=lift(now),offset=up*geo.maxH,bounce=up?0:Math.abs(Math.sin(time/95))*4;
  character.style.transform=`translateY(${-offset-bounce}px) rotate(${up?-8:Math.sin(time/95)*4}deg)`;
  shadow.style.transform=`scale(${1-up*.4})`;shadow.style.opacity=String(.18-up*.09);
  placeChef(Number(scene.dataset.chase||0),dt);
  const bottom=geo.base+offset,top=bottom+geo.ch*.88,half=geo.size/2;
  items=items.filter(item=>{
   if(item.done)return false;
   item.x-=speed*dt;
   item.el.style.transform=`translate3d(${item.x-half}px,${-item.y+half}px,0)`;
   if(Math.abs(item.x-geo.cx)<geo.ch*.32&&item.y>bottom+geo.ch*.1&&item.y<top){collect(item);return false;}
   if(item.x<-40){item.el.remove();return false;}
   return true;
  });
  frame=requestAnimationFrame(tick);
 }
 function resume(){if(!frame&&visible&&!document.hidden&&!paused)frame=requestAnimationFrame(tick);}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{threshold:0}).observe(scene);
 new ResizeObserver(()=>{geo=null;}).observe(world);
 document.addEventListener('visibilitychange',resume);
 $('.hud-pause').onclick=()=>{paused=!paused;motion();resume();};
 reduced.addEventListener('change',()=>{paused=reduced.matches;motion();resume();});
 /* Saltar: un toque en el escenario (sin botón aparte) o la barra espaciadora. */
 world.addEventListener('pointerdown',e=>{if(e.target.closest('button,.runner-over'))return;e.preventDefault();jump();});
 world.addEventListener('keydown',e=>{if(e.target!==world)return;if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();jump();}});
 startButton.addEventListener('click',()=>{geo=null;jumped=false;say('¡Toca para saltar!');requestAnimationFrame(()=>root.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'}));resume();});
 root.querySelector('.game-back-home').addEventListener('click',()=>{geo=null;requestAnimationFrame(()=>root.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'}));});
 const cheers=['¡Delicioso!','¡Qué rico!','¡Buena elección!','¡Mmm!'];
 root.querySelector('#cup-editor').addEventListener('change',e=>{if(!e.target.matches('input'))return;requestAnimationFrame(()=>{if(root.querySelector('.warning').textContent)return;jump();spawn('spark');scene.classList.remove('runner-reward');void scene.offsetWidth;scene.classList.add('runner-reward');scene.dispatchEvent(new Event('runner-choice'));clearTimeout(rewardTimer);rewardTimer=setTimeout(()=>scene.classList.remove('runner-reward'),900);});});
 scene.addEventListener('runner-choice',()=>{if(!scene.dataset.saved)say(cheers[Math.floor(Math.random()*cheers.length)]);});
 scene.addEventListener('challenge-resume',resume);
 motion();resume();
})();
