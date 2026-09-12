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
  function initScrollChoreography(){
    var items=Array.from(document.querySelectorAll("[data-hero-lab],[data-scroll-media],[data-research-row],[data-member-card]"));
    var scheduled=false;
    items.filter(function(item){return item.hasAttribute("data-member-card");}).forEach(function(item,i){item.style.setProperty("--member-index",i);});
    function update(){
      scheduled=false;
      if(reduceMotion.matches)return;
      items.forEach(function(item){
        var rect=item.getBoundingClientRect(),travel=window.innerHeight+rect.height;
        var progress=Math.min(Math.max((window.innerHeight-rect.top)/travel,0),1);
        item.style.setProperty("--scroll-progress",progress.toFixed(3));
      });
    }
    function schedule(){if(scheduled)return;scheduled=true;window.requestAnimationFrame(update);}
    window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule,{passive:true});schedule();
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
    var viewport=carousel.querySelector(".carousel-viewport");
    var index=0,timer=0,paused=false,currentOffset=0,maxOffset=0,positions=[],animation=0,wheelLock=false;
    var dragging=false,startX=0,startOffset=0,lastX=0,lastTime=0,velocity=0;
    function clamp(value,min,max){return Math.min(Math.max(value,min),max);}
    function measure(){
      var trackWidth=track.scrollWidth;
      maxOffset=Math.max(0,trackWidth-viewport.clientWidth+parseFloat(getComputedStyle(viewport).paddingLeft));
      positions=slides.map(function(slide){return clamp(slide.offsetLeft-track.offsetLeft,0,maxOffset);});
      currentOffset=positions[index]||0;
      applyOffset(currentOffset);
    }
    function applyOffset(value){currentOffset=clamp(value,0,maxOffset);track.style.transform="translate3d("+(-currentOffset)+"px,0,0)";}
    function easeOutQuint(t){return 1-Math.pow(1-t,5);}
    function animateTo(target){
      window.cancelAnimationFrame(animation);
      var from=currentOffset,to=positions[target]||0,start=performance.now(),duration=reduceMotion.matches?0:760;
      function frame(now){var t=duration?clamp((now-start)/duration,0,1):1;applyOffset(from+(to-from)*easeOutQuint(t));if(t<1)animation=window.requestAnimationFrame(frame);}
      animation=window.requestAnimationFrame(frame);
    }
    function updateMeta(){
      slides.forEach(function(slide,i){slide.classList.toggle("is-current",i===index);slide.setAttribute("aria-hidden",i===index?"false":"true");});
      status.textContent=String(index+1).padStart(2,"0")+" / "+String(slides.length).padStart(2,"0");
      progress.style.transform="scaleX("+((index+1)/slides.length)+")";
    }
    function render(){animateTo(index);updateMeta();}
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
    viewport.addEventListener("pointerdown",function(event){
      dragging=true;paused=true;window.clearInterval(timer);window.cancelAnimationFrame(animation);viewport.classList.add("is-dragging");viewport.setPointerCapture(event.pointerId);startX=lastX=event.clientX;startOffset=currentOffset;lastTime=performance.now();velocity=0;
    });
    viewport.addEventListener("pointermove",function(event){
      if(!dragging)return;var now=performance.now(),delta=event.clientX-lastX,elapsed=Math.max(now-lastTime,1);velocity=delta/elapsed;lastX=event.clientX;lastTime=now;applyOffset(startOffset-(event.clientX-startX));
    });
    function finishDrag(event){
      if(!dragging)return;dragging=false;viewport.classList.remove("is-dragging");if(viewport.hasPointerCapture(event.pointerId))viewport.releasePointerCapture(event.pointerId);
      var projected=clamp(currentOffset-velocity*180,0,maxOffset),nearest=0,distance=Infinity;
      positions.forEach(function(position,i){var d=Math.abs(position-projected);if(d<distance){distance=d;nearest=i;}});goToSlide(nearest,true);
    }
    viewport.addEventListener("pointerup",finishDrag);viewport.addEventListener("pointercancel",finishDrag);
    viewport.addEventListener("wheel",function(event){
      var delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
      var canAdvance=(delta>0&&index<slides.length-1)||(delta<0&&index>0);
      if(!canAdvance||wheelLock||Math.abs(delta)<8)return;
      event.preventDefault();wheelLock=true;goToSlide(index+(delta>0?1:-1),true);window.setTimeout(function(){wheelLock=false;},820);
    },{passive:false});
    document.addEventListener("visibilitychange",function(){if(document.hidden)window.clearInterval(timer);else start();});
    var resizeObserver="ResizeObserver" in window?new ResizeObserver(function(){requestFrame(measure);}):null;
    if(resizeObserver)resizeObserver.observe(viewport);else window.addEventListener("resize",function(){requestFrame(measure);});
    reduceMotion.addEventListener("change",function(){paused=reduceMotion.matches;if(paused)window.clearInterval(timer);else start();});
    Promise.all(slides.map(function(slide){var image=slide.querySelector("img");return image&&image.decode?image.decode().catch(function(){}):Promise.resolve();})).then(function(){measure();render();start();});
  }
  initReveal();initScrollState();initScrollChoreography();initCarousel();root.classList.add("motion-ready");
}());
