(()=>{
 const hero=document.querySelector('.hero'),slides=[...hero.querySelectorAll('.hero-slide')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,timer,visible=true;
 function schedule(){clearTimeout(timer);if(!reduced.matches&&!document.hidden&&visible)timer=setTimeout(next,6500);}
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
 const photos=document.querySelectorAll('.handmade>img,.sweet-moments>img,.details-pictures figure,.about-copy,.team-collage');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('photo-visible');observer.unobserve(entry.target);}}),{threshold:.12});
 photos.forEach(photo=>{photo.classList.add('photo-reveal');observer.observe(photo);});
})();

