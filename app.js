(function(){
  "use strict";
  var root=document.documentElement;
  var reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  var raf=0;
  function requestFrame(callback){if(raf)return;raf=window.requestAnimationFrame(function(){raf=0;callback();});}
  function initReveal(){
    var items=document.querySelectorAll("[data-reveal]");
    if(reduceMotion.matches||!("IntersectionObserver" in window)){items.forEach(function(item){item.classList.add("is-visible");});return;}
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});},{threshold:.12,rootMargin:"0px 0px -7%"});
    items.forEach(function(item){observer.observe(item);});
  }
  function initScrollState(){
    var progress=document.querySelector(".scroll-progress");
    var links=Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
    var sections=links.map(function(link){return document.querySelector(link.getAttribute("href"));}).filter(Boolean);
    function update(){
      var top=window.scrollY||root.scrollTop;
      var length=root.scrollHeight-window.innerHeight;
      if(progress)progress.style.transform="scaleX("+(length>0?top/length:0)+")";
      if(!reduceMotion.matches)root.style.setProperty("--hero-shift",Math.min(top*.08,54)+"px");
      var active=sections[0];
      sections.forEach(function(section){if(section.getBoundingClientRect().top<=window.innerHeight*.4)active=section;});
      links.forEach(function(link){var current=active&&link.getAttribute("href")==="#"+active.id;link.classList.toggle("is-active",Boolean(current));if(current)link.setAttribute("aria-current","location");else link.removeAttribute("aria-current");});
    }
    window.addEventListener("scroll",function(){requestFrame(update);},{passive:true});update();
  }
  function initCarousel(){
    var carousel=document.querySelector("[data-carousel]");
    if(!carousel)return;
    var track=carousel.querySelector("[data-carousel-track]");
    var slides=Array.from(track.children);
    var previous=carousel.querySelector("[data-carousel-prev]");
    var next=carousel.querySelector("[data-carousel-next]");
    var status=carousel.querySelector("[data-carousel-status]");
    var progress=carousel.querySelector("[data-carousel-progress]");
    var index=0,timer=0,paused=false;
    function slideOffset(target){return slides[target].offsetLeft-track.offsetLeft;}
    function render(){
      if(window.matchMedia("(max-width: 600px)").matches)return;
      track.style.transform="translate3d(-"+slideOffset(index)+"px,0,0)";
      status.textContent=String(index+1).padStart(2,"0")+" / "+String(slides.length).padStart(2,"0");
      progress.style.transform="scaleX("+((index+1)/slides.length)+")";
    }
    function goToSlide(target,userInitiated){
      index=(target+slides.length)%slides.length;
      render();
      if(userInitiated){paused=true;window.clearInterval(timer);}
    }
    function start(){window.clearInterval(timer);if(!reduceMotion.matches&&!paused&&!document.hidden)timer=window.setInterval(function(){goToSlide(index+1,false);},5200);}
    previous.addEventListener("click",function(){goToSlide(index-1,true);});
    next.addEventListener("click",function(){goToSlide(index+1,true);});
    carousel.addEventListener("keydown",function(event){if(event.key==="ArrowLeft"){event.preventDefault();goToSlide(index-1,true);}if(event.key==="ArrowRight"){event.preventDefault();goToSlide(index+1,true);}});
    carousel.addEventListener("mouseenter",function(){window.clearInterval(timer);});
    carousel.addEventListener("mouseleave",start);
    carousel.addEventListener("focusin",function(){window.clearInterval(timer);});
    carousel.addEventListener("pointerdown",function(){paused=true;window.clearInterval(timer);});
    document.addEventListener("visibilitychange",function(){if(document.hidden)window.clearInterval(timer);else start();});
    window.addEventListener("resize",function(){requestFrame(render);});
    reduceMotion.addEventListener("change",function(){paused=reduceMotion.matches;if(paused)window.clearInterval(timer);else start();});
    render();start();
  }
  initReveal();initScrollState();initCarousel();root.classList.add("motion-ready");
}());
