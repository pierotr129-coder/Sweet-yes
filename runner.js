/* Decorative runner: never changes cart values, prices or selections. */
(()=>{
 const root=document.querySelector('#vaso'),invite=root.querySelector('.game-invite'),game=root.querySelector('#cup-game');
 invite.querySelector(':scope > img')?.remove();
 invite.querySelector('h3').innerHTML='¡Corre, salta<br>y crea tu vaso!';
 invite.querySelector('p').textContent='Acompaña a nuestra fresita en una aventura de sabor. Tú eliges los ingredientes; ella pone los saltos.';
 const scene=document.createElement('div');scene.className='sweet-runner';
 scene.innerHTML=`<div class="runner-hud"><span>SWEET YES · AVENTURA DE SABOR</span><button type="button" class="runner-motion" aria-pressed="false" aria-label="Pausar animación">Ⅱ</button></div><div class="runner-world" aria-hidden="true"><div class="runner-cloud cloud-one"></div><div class="runner-cloud cloud-two"></div><div class="runner-hills"></div><div class="runner-trail"></div><div class="runner-shadow"></div><div class="runner-character"><img src="assets/marca/fresita-runner.webp" width="140" height="140" alt=""></div><div class="runner-obstacle"><i></i><i></i><i></i></div><div class="runner-spark">✦</div><div class="runner-ground"></div></div><div class="runner-footer"><span class="runner-message">¡Vamos por tu combinación favorita!</span><button type="button" class="runner-jump">¡Salta! ↑</button></div>`;
 invite.append(scene);
 const character=scene.querySelector('.runner-character'),obstacle=scene.querySelector('.runner-obstacle'),spark=scene.querySelector('.runner-spark'),shadow=scene.querySelector('.runner-shadow'),world=scene.querySelector('.runner-world'),message=scene.querySelector('.runner-message');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,visible=false,frame=0,last=0,time=0,manual=0,rewardTimer;
 function motion(){scene.classList.toggle('runner-paused',paused);const b=scene.querySelector('.runner-motion');b.textContent=paused?'▶':'Ⅱ';b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',paused?'Reanudar animación':'Pausar animación');}
 function tick(now){frame=0;if(!visible||document.hidden||paused){last=0;return;}const dt=last?Math.min(40,now-last):0;last=now;time+=dt;
  const width=world.clientWidth,base=width*.23,phase=(time%3200)/3200,x=width+60-phase*(width+180),distance=x-base;
  const auto=Math.max(0,1-Math.abs(distance)/95),extra=manual?Math.max(0,Math.sin(Math.min(1,(now-manual)/750)*Math.PI)):0;
  if(manual&&now-manual>750)manual=0;
  const jump=Math.max(auto,extra),bounce=jump?0:Math.abs(Math.sin(time/95))*5;
  character.style.transform=`translateY(${-jump*Math.min(85,world.clientHeight*.36)-bounce}px) rotate(${jump?-10:Math.sin(time/95)*4}deg)`;
  obstacle.style.transform=`translateX(${x}px) rotate(${phase*160}deg)`;
  spark.style.transform=`translateX(${x+90}px) translateY(${-Math.sin(phase*Math.PI)*18}px)`;
  shadow.style.transform=`scale(${1-jump*.4})`;shadow.style.opacity=String(.18-jump*.09);
  frame=requestAnimationFrame(tick);
 }
 function resume(){if(!frame&&visible&&!document.hidden&&!paused)frame=requestAnimationFrame(tick);}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{threshold:0}).observe(scene);
 document.addEventListener('visibilitychange',resume);
 scene.querySelector('.runner-motion').onclick=()=>{paused=!paused;motion();resume();};
 reduced.addEventListener('change',()=>{paused=reduced.matches;motion();resume();});
 scene.querySelector('.runner-jump').onclick=()=>{if(!reduced.matches){manual=performance.now();resume();}message.textContent='¡Ese salto estuvo delicioso!';};
 root.querySelector('.game-start').addEventListener('click',()=>{game.querySelector('.game-top').after(scene);scene.classList.add('runner-playing');message.textContent='Elige tu tamaño. ¡La aventura comienza!';resume();});
 root.querySelector('.game-back-home').addEventListener('click',()=>{invite.append(scene);scene.classList.remove('runner-playing');resume();});
 root.querySelector('#cup-editor').addEventListener('change',e=>{if(!e.target.matches('input'))return;requestAnimationFrame(()=>{if(root.querySelector('.warning').textContent)return;manual=performance.now();scene.classList.remove('runner-reward');void scene.offsetWidth;scene.classList.add('runner-reward');message.textContent='¡Una elección más para tu vaso!';clearTimeout(rewardTimer);rewardTimer=setTimeout(()=>scene.classList.remove('runner-reward'),900);});});
 root.querySelector('.game-next').addEventListener('click',()=>{if(!root.querySelector('.warning').textContent)message.textContent=root.querySelector('.game-count').textContent+' · ¡Sigamos!';});
 motion();resume();
})();

