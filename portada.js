(()=>{
 const hero=document.querySelector('.hero'),slides=[...hero.querySelectorAll('.hero-slide')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,timer,visible=true;
 function schedule(){clearTimeout(timer);if(!reduced.matches&&!document.hidden&&visible)timer=setTimeout(next,3400);}
 async function next(){const nextIndex=(index+1)%slides.length;try{await slides[nextIndex].querySelector('img').decode();index=nextIndex;slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',String(i!==index));});}catch{}schedule();}
 document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.1}).observe(hero);
 // Each repeated ribbon group must cover the viewport before looping.
 const track=document.querySelector('.flavor-ribbon>div');const original=track.firstElementChild.innerHTML;
 function fillRibbon(){
  const group=track.firstElementChild;group.innerHTML=original;
  // A hidden/unmeasured flex item can report zero width. Never loop on layout.
  const width=group.getBoundingClientRect().width;
  const repeats=width>0?Math.min(12,Math.max(1,Math.ceil((innerWidth+100)/width))):1;
  group.innerHTML=original.repeat(repeats);track.lastElementChild.innerHTML=group.innerHTML;
 }
 let ribbonFrame;
 function queueRibbon(){cancelAnimationFrame(ribbonFrame);ribbonFrame=requestAnimationFrame(fillRibbon);}
 fillRibbon();window.addEventListener('resize',queueRibbon);
 if(document.fonts)document.fonts.ready.then(queueRibbon);
 const photos=document.querySelectorAll('.handmade>img,.sweet-moments>img,.details-pictures figure,.about-copy,.team-collage,.story-heading,.story-step');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('photo-visible');observer.unobserve(entry.target);}}),{threshold:.12});
 photos.forEach(photo=>{photo.classList.add('photo-reveal');observer.observe(photo);});
 const starsObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('stars-visible');starsObserver.unobserve(entry.target);}}),{threshold:.6});
 document.querySelectorAll('.review-stars').forEach(stars=>starsObserver.observe(stars));
 // Follow the story's curved route while scrolling, without a continuous JS loop.
 const route=document.querySelector('.story-route'),thread=document.querySelector('.story-thread');
 const path=thread?.querySelector('path'),mascot=document.querySelector('.story-mascot');
 if(route&&path&&mascot){
  const length=path.getTotalLength();let frame,storyVisible=false;
  function positionMascot(){
   frame=null;if(!storyVisible)return;
   const box=route.getBoundingClientRect(),line=thread.getBoundingClientRect();
   const progress=reduced.matches?0:Math.max(0,Math.min(1,(innerHeight*.55-box.top)/box.height));
   const point=path.getPointAtLength(length*progress);
   mascot.style.left=(line.left-box.left+point.x/200*line.width)+'px';
   mascot.style.top=(line.top-box.top+point.y/900*line.height)+'px';
  }
  function queuePosition(){if(!frame&&storyVisible)frame=requestAnimationFrame(positionMascot);}
  new IntersectionObserver(entries=>{storyVisible=entries[0].isIntersecting;route.classList.toggle('in-view',storyVisible);queuePosition();},{rootMargin:'100px'}).observe(route);
  window.addEventListener('scroll',queuePosition,{passive:true});window.addEventListener('resize',queuePosition,{passive:true});
  reduced.addEventListener('change',queuePosition);
 }
})();

