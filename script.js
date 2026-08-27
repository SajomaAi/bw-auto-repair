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

  /* --- Form handlers (Web3Forms) --- */
  var W3F_ENDPOINT = 'https://api.web3forms.com/submit';

  function setFormState(form, state) {
    // state: 'loading' | 'success' | 'error' | 'reset'
    var btn = form.querySelector('button[type="submit"]');
    var successEl = form.querySelector('.form-success');
    var errorEl   = form.querySelector('.form-error');
    if (successEl) successEl.style.display = 'none';
    if (errorEl)   errorEl.style.display   = 'none';
    if (btn) {
      btn.disabled = (state === 'loading');
      btn.style.opacity = (state === 'loading') ? '0.7' : '';
    }
    if (state === 'success' && successEl) successEl.style.display = 'flex';
    if (state === 'error'   && errorEl)   errorEl.style.display   = 'flex';
  }

  window.handleAppointment = function (e) {
    e.preventDefault();
    var form = e.target;
    setFormState(form, 'loading');

    var data = new FormData(form);
    fetch(W3F_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    })
    .then(function (res) { return res.json(); })
    .then(function (json) {
      if (json.success) {
        setFormState(form, 'success');
        form.reset();
        setTimeout(function () { setFormState(form, 'reset'); }, 6000);
      } else {
        console.error('Web3Forms error:', json);
        setFormState(form, 'error');
        setTimeout(function () { setFormState(form, 'reset'); }, 6000);
      }
    })
    .catch(function (err) {
      console.error('Network error:', err);
      setFormState(form, 'error');
      setTimeout(function () { setFormState(form, 'reset'); }, 6000);
    });
  };

  /* --- QuickBooks payment link ---------------------------------------
     Paste your QuickBooks payment link between the quotes below and the
     "Pay Now" button on the invoice section goes live. Get one from
     QuickBooks: Sales > Payment links > create a link, then copy the URL.

     Leave it empty and the page shows the "request a payment link" form
     instead, which emails the shop so a link can be sent per invoice.

     Card details are never collected on this site. Payment happens on
     QuickBooks' own hosted page, which is what keeps us out of scope for
     handling card data at all.                                          */
  var QBO_PAYMENT_LINK = '';

  (function initPaymentLink() {
    if (!QBO_PAYMENT_LINK) return;
    var direct = document.getElementById('payDirect');
    var btn    = document.getElementById('payNowBtn');
    var request= document.getElementById('payRequestBlock');
    if (btn)     btn.setAttribute('href', QBO_PAYMENT_LINK);
    if (direct)  direct.style.display = '';
    if (request) request.classList.add('pay-secondary');
  })();

})();
