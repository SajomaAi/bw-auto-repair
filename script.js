/* ============================================
   B&W Auto Repair LLC — Main Script
   ============================================ */

(function () {
  'use strict';

  /* --- Preloader --- */
  window.addEventListener('load', function () {
    var pre = document.getElementById('preloader');
    if (pre) {
      setTimeout(function () {
        pre.classList.add('hidden');
        setTimeout(function () { pre.style.display = 'none'; }, 500);
      }, 1600);
    }
    initScrollAnimations();
    initCountUp();
  });

  /* --- Navbar scroll effect --- */
  var navbar = document.getElementById('navbar');
  var topBar = document.getElementById('topBar');
  var backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 50);
    if (backToTop) backToTop.classList.toggle('visible', y > 600);
  });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Mobile nav toggle --- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function closeMenu() {
    if (navToggle) navToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  overlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
      // Active state
      document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --- Active nav on scroll --- */
  var sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY + 200;
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      var id = sec.getAttribute('id');
      var link = document.querySelector('.nav-link[href="#' + id + '"]');
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      }
    });
  });

  /* --- Scroll animations --- */
  function initScrollAnimations() {
    var items = document.querySelectorAll('.service-card, .stat-item, .about-feature, .appointment-form, .payment-form, .section-header, .about-image-area, .about-content, .cta-content');
    items.forEach(function (el) {
      el.classList.add('animate-on-scroll');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --- Count-up animation for stats --- */
  function initCountUp() {
    var counters = document.querySelectorAll('.stat-number[data-count]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          animateCount(el, 0, target, 2000);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  function animateCount(el, start, end, duration) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * (end - start) + start).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* --- Bilingual toggle --- */
  var currentLang = 'en';

  window.toggleLang = function () {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    document.documentElement.setAttribute('data-lang', currentLang);

    document.querySelectorAll('[data-en][data-es]').forEach(function (el) {
      var text = el.getAttribute('data-' + currentLang);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else if (el.tagName === 'OPTION') {
          el.textContent = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update lang labels
    var langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.textContent = currentLang === 'en' ? 'ES' : 'EN';
  };

  /* --- Form handlers --- */
  window.handleAppointment = function (e) {
    e.preventDefault();
    var form = e.target;
    var success = document.getElementById('formSuccess');
    if (success) {
      success.style.display = 'flex';
      form.reset();
      setTimeout(function () { success.style.display = 'none'; }, 5000);
    }
  };

  window.handlePayment = function (e) {
    e.preventDefault();
    alert(currentLang === 'es'
      ? '¡Gracias! Su pago está siendo procesado. Recibirá una confirmación pronto.'
      : 'Thank you! Your payment is being processed. You will receive a confirmation shortly.');
    e.target.reset();
  };

})();
