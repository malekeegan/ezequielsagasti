/* ============================================================
   Animaciones del sitio Ezequiel Sagasti
   - Entrada escalonada (al cargar)
   - Máquina de escribir (citas + nombre del home)
   Respeta prefers-reduced-motion.
   ============================================================ */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;
  if(!reduce) html.classList.add('anims');

  // máquina de escribir (texto sin markup interno: citas)
  function typeIf(el){
    if(!el.hasAttribute('data-typewriter') || reduce) return;
    var txt = el.getAttribute('data-tw') || el.textContent.trim();
    el.setAttribute('data-tw', txt);
    el.textContent = '';
    el.classList.add('typing');
    var i = 0;
    (function tick(){
      el.textContent = txt.slice(0, i);
      i++;
      if(i <= txt.length){ setTimeout(tick, 38); }
      else { el.classList.remove('typing'); }
    })();
  }

  // máquina de escribir por barrido (preserva cursiva y no recorta; nombre del home)
  function typeLine(el){
    if(reduce) return;
    el.style.clipPath = 'inset(0 100% 0 0)';
    void el.offsetWidth;
    el.style.transition = 'clip-path 1.05s steps(18, end)';
    el.style.clipPath = 'inset(0 0 0 0)';
    setTimeout(function(){ el.style.clipPath = ''; el.style.transition = ''; }, 1250);
  }

  function start(){
    // citas: disparan al entrar en viewport
    var tw = document.querySelectorAll('[data-typewriter]');
    if(reduce){ /* dejar texto tal cual */ }
    else {
      var obs = new IntersectionObserver(function(es){
        es.forEach(function(en){ if(en.isIntersecting){ typeIf(en.target); obs.unobserve(en.target); } });
      }, { threshold: 0.4 });
      tw.forEach(function(el){ obs.observe(el); });
    }
    // nombre del home: arranca tras la entrada escalonada
    var line = document.querySelector('[data-typeline]');
    if(line && !reduce){ setTimeout(function(){ typeLine(line); }, 560); }
  }

  if(document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
