/* Ezequiel Sagasti — interacciones
   Se carga en el <head>; todo el contenido es visible sin JS. */
(function(){
  var html=document.documentElement;
  html.classList.add('js');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce) html.classList.add('anims');

  function menu(){
    var m=document.getElementById('menu'),b=document.getElementById('burger'),c=document.getElementById('close');
    if(!m||!b||!c) return;
    function open(){m.classList.add('open');b.setAttribute('aria-expanded','true');m.setAttribute('aria-hidden','false');c.focus();}
    function close(){m.classList.remove('open');b.setAttribute('aria-expanded','false');m.setAttribute('aria-hidden','true');b.focus();}
    b.addEventListener('click',open);c.addEventListener('click',close);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('open'))close();});
  }

  function pad(n){return (n<10?'0':'')+n;}
  function galleries(){
    document.querySelectorAll('[data-gallery]').forEach(function(g){
      var items=[].slice.call(g.querySelectorAll('.g-list img')).map(function(i){return {src:i.getAttribute('src'),alt:i.getAttribute('alt')};});
      if(items.length<2) return;
      var n=items.length,cur=0;
      var track=document.createElement('div');track.className='g-track';
      track.innerHTML='<button class="g-side" type="button" aria-label="Foto anterior"><img alt=""></button><figure><img></figure><button class="g-side" type="button" aria-label="Foto siguiente"><img alt=""></button>';
      var ctrl=document.createElement('div');ctrl.className='g-ctrl';
      ctrl.innerHTML='<button class="g-btn" type="button" aria-label="Foto anterior">‹</button><span class="g-count" aria-live="polite"></span><button class="g-btn" type="button" aria-label="Foto siguiente">›</button>';
      var im=track.querySelectorAll('img'),side=track.querySelectorAll('.g-side'),btn=ctrl.querySelectorAll('.g-btn'),cnt=ctrl.querySelector('.g-count');
      function render(){
        var p=items[(cur-1+n)%n],c=items[cur],x=items[(cur+1)%n];
        im[0].src=p.src;im[1].src=c.src;im[1].alt=c.alt;im[2].src=x.src;
        cnt.innerHTML='<b>'+pad(cur+1)+'</b> / '+pad(n);
      }
      function go(d){cur=(cur+d+n)%n;render();}
      side[0].addEventListener('click',function(){go(-1);});side[1].addEventListener('click',function(){go(1);});
      btn[0].addEventListener('click',function(){go(-1);});btn[1].addEventListener('click',function(){go(1);});
      var x0=null;
      track.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
      track.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(dx<-40)go(1);else if(dx>40)go(-1);x0=null;},{passive:true});
      g.appendChild(track);g.appendChild(ctrl);render();g.classList.add('is-on');
    });
  }

  function typeIf(el){
    var txt=el.textContent.trim();el.textContent='';el.classList.add('typing');
    var i=0;(function tick(){el.textContent=txt.slice(0,i);i++;if(i<=txt.length)setTimeout(tick,38);else el.classList.remove('typing');})();
  }
  function typewriters(){
    if(reduce||!('IntersectionObserver' in window)) return;
    var obs=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){typeIf(en.target);obs.unobserve(en.target);}});},{threshold:.4});
    document.querySelectorAll('[data-typewriter]').forEach(function(el){obs.observe(el);});
  }

  function start(){
    try{menu();}catch(e){}
    try{galleries();}catch(e){}
    try{typewriters();}catch(e){}
  }
  if(document.readyState!=='loading') start(); else document.addEventListener('DOMContentLoaded',start);
})();
