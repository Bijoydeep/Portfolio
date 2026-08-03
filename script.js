(function(){
  "use strict";

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- mobile nav ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });

  /* ---- avatar: show real photo if it loads, else keep initials ---- */
  var img = document.getElementById('profileImg');
  var fallback = document.getElementById('initialsFallback');
   function showPhoto() {
    if (img) img.style.display = 'block';
    if (fallback) fallback.style.display = 'none';
  }
  if (img) {
    if (img.complete && img.naturalWidth > 0) {
      showPhoto();
    } else {
      img.addEventListener('load', showPhoto);
      img.addEventListener('error', function(){
        img.style.display = 'none';
        if (fallback) fallback.style.display = 'block';
      });
    }
  }
  /*img.addEventListener('load', function(){
    img.style.display = 'block';
    fallback.style.display = 'none';
  });
  img.addEventListener('error', function(){
    img.style.display = 'none';
  });
*/
  /* ---- scroll reveal (IntersectionObserver, cheap) ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- signature signal trace: a single path drawn down the page,
     connecting one node per section, animated via requestAnimationFrame
     throttled scroll updates (no layout thrashing) ---- */
  var svg = document.getElementById('trace-canvas');
  var path = document.getElementById('trace-path');
  var nodesGroup = document.getElementById('trace-nodes');
  var sections = Array.from(document.querySelectorAll('section[id]'));
  var ticking = false;
  var nodeEls = [];

  function buildTrace(){
    var w = window.innerWidth;
    var h = document.documentElement.scrollHeight;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.style.height = h + 'px';

    var x = Math.min(48, w * 0.035);
    var d = 'M ' + x + ' 0 L ' + x + ' ' + h;
    path.setAttribute('d', d);

    nodesGroup.innerHTML = '';
    nodeEls = [];
    sections.forEach(function(sec){
      var rect = sec.getBoundingClientRect();
      var top = rect.top + window.scrollY;
      var cy = top + 40;
      var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', 5);
      circle.setAttribute('class','trace-node');
      nodesGroup.appendChild(circle);
      nodeEls.push({ el: circle, y: cy });
    });
  }

  function updateTrace(){
    var scrollY = window.scrollY;
    var viewCenter = scrollY + window.innerHeight * 0.35;
    nodeEls.forEach(function(n){
      if(scrollY + window.innerHeight > n.y && n.y > scrollY - 100){
        n.el.classList.add('lit');
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', function(){
    if(!ticking){
      window.requestAnimationFrame(updateTrace);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', function(){
    buildTrace();
    updateTrace();
  });

  window.addEventListener('load', function(){
    buildTrace();
    updateTrace();
  });
  // build early too in case load fires late on slow connections
  buildTrace();

  /* ---- contact form: mailto fallback, no backend required ---- */
  var form = document.getElementById('contactForm');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cname').value;
    var email = document.getElementById('cemail').value;
    var msg = document.getElementById('cmsg').value;
    var subject = encodeURIComponent('Portfolio contact from ' + name);
    var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:your.email@example.com?subject=' + subject + '&body=' + body;
  });

})();
