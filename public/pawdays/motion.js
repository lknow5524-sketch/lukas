window.mountPawMotion=function(){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');const scene=document.querySelector('.film-story');let active=true,scheduled=false;const clamp=x=>Math.min(1,Math.max(0,x));
 const run=()=>{scheduled=false;if(!active||!scene)return;const portal=scene.querySelector('.film-portal'),rim=scene.querySelector('.film-rim'),title=scene.querySelector('.film-heading'),intro=scene.querySelector('.film-intro'),copy=scene.querySelector('.film-message'),cue=scene.querySelector('.film-scroll');if(reduce.matches){portal.style.clipPath='';portal.firstElementChild.removeAttribute('style');title.style.transform='';title.style.opacity=1;intro.style.opacity=1;rim.style.opacity=1;copy.style.opacity=0;cue.style.opacity=1;return}const p=clamp(-scene.getBoundingClientRect().top/(scene.offsetHeight-innerHeight));const q=clamp(p*1.4),mobile=innerWidth<=800;const stage=scene.querySelector('.film-stage');const a=mobile?[rim.offsetTop/stage.clientHeight*100,22,(stage.clientHeight-rim.offsetTop-rim.offsetHeight)/stage.clientHeight*100,22]:[14,36,12,36];portal.style.clipPath=`inset(${a[0]*(1-q)}% ${a[1]*(1-q)}% ${a[2]*(1-q)}% ${a[3]*(1-q)}% round ${260*(1-q)}px)`;const frame=portal.firstElementChild;frame.style.left=`${a[3]*(1-q)}%`;frame.style.top=`${a[0]*(1-q)}%`;frame.style.width=`${100-(a[1]+a[3])*(1-q)}%`;frame.style.height=`${100-(a[0]+a[2])*(1-q)}%`;frame.style.transform='none';rim.style.opacity=1-clamp(p*7);title.style.opacity=1-clamp(p*3);title.style.transform=`translateY(${-p*80}px)`;intro.style.opacity=1-clamp(p*3);cue.style.opacity=1-clamp(p*6);copy.style.opacity=clamp((p-.42)*3);copy.style.transform=`translateY(${(1-clamp((p-.42)*3))*40}px)`;
 const world=document.querySelector('.film-world');if(world){const wr=world.getBoundingClientRect();const wp=clamp((innerHeight-wr.top)/(innerHeight+world.offsetHeight));world.style.setProperty('--turn',`${(wp-.5)*35}deg`);world.style.setProperty('--drift',`${(wp-.5)*-65}px`)}}
 const request=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(run)}};addEventListener('scroll',request,{passive:true});addEventListener('resize',request);reduce.addEventListener('change',request);run();
 const targets=document.querySelectorAll('.film-statement,.film-section-head,.film-community .post,.film-guide-heading,.film-guide-grid,.film-world-copy,.chapter-opening,.chapter-bridge,.chapter-content .guide-card,.chapter-content .product,.chapter-content .stats');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-seen');observer.unobserve(e.target)}}),{threshold:.08});targets.forEach(el=>{el.classList.add('motion-reveal');observer.observe(el)});
 window.pawMotionCleanup=()=>{active=false;removeEventListener('scroll',request);removeEventListener('resize',request);reduce.removeEventListener('change',request);observer.disconnect()};
};

// A shared aperture connects the four destinations; local actions never trigger it.
let pawRouteSequence=0;
window.pawRouteChange=async function(commit){
 const sequence=++pawRouteSequence;document.querySelector('.route-veil')?.remove();
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){commit();return}
 const veil=document.createElement('div');veil.className='route-veil';veil.setAttribute('aria-hidden','true');
 const names={community:'一起生活',guide:'陪伴指南',shop:'日常好物',mine:'我们的故事'};
 const title=document.createElement('span');title.textContent=names[location.hash.slice(1)]||'爪爪日常';veil.append(title);document.body.append(veil);
 try{await veil.animate([{clipPath:'circle(0% at 50% 100%)'},{clipPath:'circle(150% at 50% 100%)'}],{duration:390,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'}).finished;if(sequence!==pawRouteSequence)return;commit();await new Promise(requestAnimationFrame);await veil.animate([{clipPath:'circle(150% at 50% 0%)',opacity:1},{clipPath:'circle(0% at 50% 0%)',opacity:1}],{duration:510,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'}).finished}finally{veil.remove()}
};

document.addEventListener('click',e=>{
 const control=e.target.closest('button,.chip,.nav-item');
 if(!control||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 control.animate([{opacity:.7,translate:'0 1px'},{opacity:1,translate:'0 0'}],{duration:220,easing:'ease-out'});
});
