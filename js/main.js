// --- Page Loader & Helpers ---
document.addEventListener('DOMContentLoaded',()=>{
  // Hide loader after content ready
  const loader=document.getElementById('page-loader');
  setTimeout(()=>{if(loader){loader.style.opacity='0';loader.setAttribute('aria-hidden','true');setTimeout(()=>loader.remove(),400)}},700);

  // Update year in footer
  const yearEl=document.getElementById('year'); if(yearEl) yearEl.textContent=new Date().getFullYear();
});

// --- Theme Toggle ---
const themeToggle=document.getElementById('theme-toggle');
if(themeToggle){
  themeToggle.addEventListener('click',()=>{
    document.body.classList.toggle('theme-dark');
    const isDark=document.body.classList.contains('theme-dark');
    themeToggle.textContent=isDark? '🌙' : '☀️';
  });
}

// --- Hamburger Menu ---
const hamburger=document.getElementById('hamburger');
const navLinks=document.getElementById('nav-links');
if(hamburger && navLinks){
  hamburger.addEventListener('click',()=>{
    const expanded=hamburger.getAttribute('aria-expanded')==='true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    navLinks.style.display = expanded? 'none' : 'flex';
  });
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',(e)=>{
    const href=a.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      const target=document.querySelector(href);
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// --- Typewriter rotating tagline ---
const typeEl=document.getElementById('typewriter-text');
const taglines=["Developer","Designer","Creator","Problem Solver"];
let ti=0,ci=0;
function typeLoop(){
  if(!typeEl) return;
  const txt=taglines[ti];
  typeEl.textContent = txt.slice(0,ci);
  ci++;
  if(ci>txt.length){
    setTimeout(()=>{ci=0;ti=(ti+1)%taglines.length;typeLoop();},1200);
  }else{
    setTimeout(typeLoop,120);
  }
}
typeLoop();

// --- Canvas particle/constellation background ---
const canvas=document.getElementById('bg-canvas');
if(canvas){
  const ctx=canvas.getContext('2d');
  let w=canvas.width=innerWidth;let h=canvas.height=innerHeight;
  window.addEventListener('resize',()=>{w=canvas.width=innerWidth;h=canvas.height=innerHeight;});

  const particles=[];
  const NUM=Math.floor((w*h)/60000)+60;
  for(let i=0;i<NUM;i++) particles.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.5+0.4,vx:(Math.random()-0.5)/2,vy:(Math.random()-0.5)/2});

  let mouse={x:-9999,y:-9999};
  window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});

  function draw(){
    ctx.clearRect(0,0,w,h);
    // subtle gradient background
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#02020a');g.addColorStop(1,'rgba(10,10,18,0.7)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);

    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0;
      // attract to mouse slightly
      const dx=mouse.x-p.x,dy=mouse.y-p.y;const d=Math.sqrt(dx*dx+dy*dy);
      if(d<140){p.vx+=dx*0.0006;p.vy+=dy*0.0006}
      ctx.beginPath();ctx.globalAlpha=0.9;ctx.fillStyle='rgba(255,255,255,0.8)';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    });

    // draw links
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a=particles[i],b=particles[j];
        const dx=a.x-b.x,dy=a.y-b.y;const dist=dx*dx+dy*dy;
        if(dist<12000){ctx.beginPath();ctx.strokeStyle='rgba(127,90,240,0.12)';ctx.lineWidth=1;ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// --- Intersection Observer for fade-in and counters/skill bars ---
const io=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('in-view');
      // counters
      entry.target.querySelectorAll('.count').forEach(el=>{if(!el.dataset.started){el.dataset.started='1';const target=+el.dataset.target;let cur=0;const step=Math.max(1,Math.round(target/60));const iv=setInterval(()=>{cur+=step;if(cur>=target){cur=target;clearInterval(iv)}el.textContent=cur},20) }});
      // skill bars
      entry.target.querySelectorAll('.skill-bar').forEach(bar=>{const p=bar.dataset.percent;bar.querySelector('.skill-bar-fill').style.width=p+'%'});
    }
  });
},{threshold:0.12});
document.querySelectorAll('.fade-in-up').forEach(el=>io.observe(el));

// Trigger observer for initial viewport elements
document.querySelectorAll('.about-section, .skills-section, .projects-section, .timeline-section, .contact-section').forEach(el=>io.observe(el));

// --- Project filter buttons ---
document.querySelectorAll('.filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const filter=btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card=>{card.style.display=(filter==='all' || card.dataset.category===filter)?'flex':'none'});
  });
});

// --- Carousel for testimonials (simple) ---
(() =>{
  const slides=document.querySelectorAll('.slide'); if(!slides.length) return; let idx=0;
  const dotsContainer=document.querySelector('.carousel-dots');
  slides.forEach((s,i)=>{const d=document.createElement('button');d.className='dot';d.addEventListener('click',()=>go(i));dotsContainer.appendChild(d)});
  function go(i){slides[idx].classList.remove('active');idx=i;slides[idx].classList.add('active');Array.from(dotsContainer.children).forEach((d,j)=>d.classList.toggle('active',j===idx));}
  setInterval(()=>go((idx+1)%slides.length),4500);
})();

// --- Contact form validation and fake submit ---
const form=document.getElementById('contact-form');
if(form){
  form.addEventListener('submit',(e)=>{
    e.preventDefault();const status=document.getElementById('form-status');
    const name=form.name.value.trim();const email=form.email.value.trim();const message=form.message.value.trim();
    if(!name||!email||!message){status.textContent='Please fill required fields.';status.style.color='var(--accent-violet)';return}
    // fake success
    status.textContent='Sending...';
    setTimeout(()=>{status.textContent='Message sent — thank you!';status.style.color='var(--accent-cyan)';form.reset()},900);
  });
}

// --- Back to top button ---
const backBtn=document.getElementById('back-to-top');
if(backBtn){backBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));}

// --- Scroll progress ---
window.addEventListener('scroll',()=>{
  const el=document.getElementById('scroll-progress'); if(!el) return; const max= document.body.scrollHeight - window.innerHeight; const pct=(window.scrollY/max)*100; el.style.width=Math.min(100,Math.max(0,pct))+'%';
});

// --- Custom cursor + trail (desktop only) ---
if(window.matchMedia('(pointer:fine)').matches){
  const cursor=document.getElementById('cursor');
  const trail=document.getElementById('cursor-trail');
  const trailNodes=[];
  for(let i=0;i<6;i++){const n=document.createElement('div');n.style.width=(6-i)+'px';n.style.height=(6-i)+'px';n.style.borderRadius='50%';n.style.position='fixed';n.style.pointerEvents='none';n.style.background='rgba(127,90,240,0.12)';n.style.zIndex='9998';document.body.appendChild(n);trailNodes.push(n)}
  window.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';trailNodes.forEach((n,idx)=>{setTimeout(()=>{n.style.left=e.clientX+'px';n.style.top=e.clientY+'px'},idx*20)})});
}

// --- Konami code easter egg ---
(() =>{
  const code=[38,38,40,40,37,39,37,39,66,65];let k=0;window.addEventListener('keydown',e=>{if(e.keyCode===code[k]){k++;if(k===code.length){k=0;document.body.classList.add('konami');setTimeout(()=>document.body.classList.remove('konami'),4000)}}else k=0});
})();

// --- Accessibility: focus outlines for keyboard users ---
let mouseDown=false;window.addEventListener('mousedown',()=>mouseDown=true);window.addEventListener('keydown',()=>mouseDown=false);
document.addEventListener('focusin',e=>{if(!mouseDown) e.target.classList.add('focus-visible')});
document.addEventListener('focusout',e=>e.target.classList.remove('focus-visible'));

// end of file
