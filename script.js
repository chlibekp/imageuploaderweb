/* ImageUploader landing page — animations & interactions */
(function () {
  'use strict';

  // ---- CONFIG -------------------------------------------------------------
  var INVITE_URL = 'https://discord.com/oauth2/authorize?client_id=1544773527452778557';
  // -------------------------------------------------------------------------

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-invite]').forEach(function (el) {
    el.href = INVITE_URL;
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---------- sticky nav border ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    nav.classList.toggle('stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('in'); }, i * 90);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px' });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- typewriter in the /upload terminal ---------- */
  var term = document.querySelector('.terminal[data-type]');
  if (term) {
    var text = term.getAttribute('data-type');
    var out = term.querySelector('.typed');
    var reply = term.querySelector('.terminal-out');

    var type = function () {
      if (reduced) {
        out.textContent = text;
        reply.classList.add('show');
        return;
      }
      var i = 0;
      out.textContent = '';
      reply.classList.remove('show');
      var tick = function () {
        out.textContent = text.slice(0, ++i);
        if (i < text.length) {
          setTimeout(tick, 55);
        } else {
          setTimeout(function () { reply.classList.add('show'); }, 450);
        }
      };
      setTimeout(tick, 300);
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { type(); obs.disconnect(); }
      }, { threshold: 0.5 }).observe(term);
    } else {
      type();
    }
  }

  /* ---------- step 03: browser upload demo ---------- */
  var drop = document.querySelector('[data-drop]');
  if (drop) {
    var msg = drop.querySelector('.drop-msg');
    var run = function () {
      if (reduced) { drop.classList.add('active', 'done'); msg.classList.add('show'); return; }
      drop.classList.add('active');
      setTimeout(function () {
        drop.classList.add('done');
        drop.querySelector('.drop-zone b').textContent = 'Upload complete';
        setTimeout(function () { msg.classList.add('show'); }, 350);
      }, 2300);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { run(); obs.disconnect(); }
      }, { threshold: 0.4 }).observe(drop);
    } else {
      run();
    }
  }

  /* ---------- fake COPY buttons in the gallery demo ---------- */
  document.querySelectorAll('.card-btns span').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.textContent !== 'COPY') return;
      var old = btn.textContent;
      btn.textContent = 'COPIED';
      setTimeout(function () { btn.textContent = old; }, 1200);
    });
  });

  /* ---------- pixel starfield ---------- */
  var canvas = document.getElementById('stars');
  if (!canvas || reduced) { if (canvas) canvas.style.display = 'none'; return; }

  var ctx = canvas.getContext('2d');
  var dots = [];
  var w = 0, h = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    var count = Math.min(110, Math.round((w * h) / 16000));
    dots = [];
    for (var i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() < 0.75 ? 2 : 3,
        v: 0.08 + Math.random() * 0.35,
        a: 0.15 + Math.random() * 0.5,
        p: Math.random() * Math.PI * 2,
        c: Math.random() < 0.7 ? '136,146,255' : '78,196,245'
      });
    }
  }

  var t = 0;
  function frame() {
    t += 0.02;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.y -= d.v;
      if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
      var alpha = d.a * (0.55 + 0.45 * Math.sin(t + d.p));
      ctx.fillStyle = 'rgba(' + d.c + ',' + alpha.toFixed(3) + ')';
      ctx.fillRect(Math.round(d.x), Math.round(d.y), d.s, d.s);
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  frame();
})();
