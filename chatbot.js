/* ============================================
   B&W Auto Repair — Embedded Chatbot Widget
   No external server dependencies.
   Uses a local knowledge base for instant answers.
   ============================================ */
(function () {
  'use strict';

  /* --- Inject chatbot CSS --- */
  var css = [
    '#bw-chat-widget *{box-sizing:border-box;margin:0;padding:0;font-family:"Barlow",sans-serif}',
    '#bw-chat-widget{position:fixed;bottom:1.5rem;right:1.5rem;z-index:999999}',
    '#bw-chat-bubble{width:62px;height:62px;background:#D72B2B;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 24px rgba(215,43,43,.55);transition:transform .2s,box-shadow .2s;position:relative;margin-left:auto;border:none}',
    '#bw-chat-bubble:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(215,43,43,.75)}',
    '.bw-pulse{position:absolute;top:-3px;right:-3px;width:14px;height:14px;background:#22c55e;border-radius:50%;border:2px solid #fff}',
    '.bw-pulse::after{content:"";position:absolute;inset:-3px;border-radius:50%;border:2px solid #22c55e;animation:bwPulse 2s infinite}',
    '@keyframes bwPulse{0%{transform:scale(1);opacity:1}100%{transform:scale(2.2);opacity:0}}',
    '#bw-chat-window{display:none;flex-direction:column;width:355px;height:510px;background:#1a1a1a;border:1px solid #3a3a3a;border-radius:6px;box-shadow:0 20px 60px rgba(0,0,0,.85);margin-bottom:.75rem;overflow:hidden}',
    '#bw-chat-window.bw-open{display:flex;animation:bwSlideUp .25s ease}',
    '@keyframes bwSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}',
    '.bw-header{background:#111;border-bottom:2px solid #D72B2B;padding:.85rem 1rem;display:flex;align-items:center;justify-content:space-between}',
    '.bw-header-left{display:flex;align-items:center;gap:.65rem}',
    '.bw-avatar{width:36px;height:36px;background:#D72B2B;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}',
    '.bw-name{font-family:"Barlow Condensed",sans-serif;font-weight:700;font-size:.9rem;color:#f5f5f5;letter-spacing:.5px}',
    '.bw-status{font-size:.7rem;color:#22c55e}',
    '.bw-close{background:none;border:none;color:#8a8a8a;cursor:pointer;font-size:1.1rem;padding:.2rem .4rem;transition:color .2s;line-height:1}',
    '.bw-close:hover{color:#f5f5f5}',
    '.bw-messages{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.85rem;scrollbar-width:thin;scrollbar-color:#3a3a3a transparent}',
    '.bw-msg{max-width:84%;animation:bwMsgIn .2s ease}',
    '@keyframes bwMsgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
    '.bw-msg.bot{align-self:flex-start}',
    '.bw-msg.user{align-self:flex-end}',
    '.bw-bubble{padding:.7rem .9rem;font-size:.86rem;line-height:1.5;border-radius:3px}',
    '.bw-msg.bot .bw-bubble{background:#2a2a2a;color:#e8e8e8;border-left:3px solid #D72B2B}',
    '.bw-msg.user .bw-bubble{background:#D72B2B;color:#fff}',
    '.bw-time{font-size:.67rem;color:#8a8a8a;margin-top:.2rem;padding:0 .2rem}',
    '.bw-msg.user .bw-time{text-align:right}',
    '.bw-typing{display:flex;align-items:center;gap:.3rem;padding:.7rem .9rem;background:#2a2a2a;border-left:3px solid #D72B2B;border-radius:3px;width:fit-content}',
    '.bw-dot{width:6px;height:6px;background:#8a8a8a;border-radius:50%;animation:bwBounce 1.2s infinite}',
    '.bw-dot:nth-child(2){animation-delay:.2s}',
    '.bw-dot:nth-child(3){animation-delay:.4s}',
    '@keyframes bwBounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}',
    '.bw-input-area{border-top:1px solid #3a3a3a;padding:.65rem;background:#111}',
    '.bw-input-row{display:flex;gap:.4rem;align-items:flex-end}',
    '#bw-input{flex:1;background:#2a2a2a;border:1px solid #3a3a3a;color:#f5f5f5;font-size:.86rem;padding:.6rem .8rem;outline:none;resize:none;min-height:36px;max-height:90px;border-radius:3px;transition:border-color .2s;line-height:1.4;font-family:"Barlow",sans-serif}',
    '#bw-input:focus{border-color:#D72B2B}',
    '#bw-input::placeholder{color:#8a8a8a}',
    '.bw-send-btn,.bw-mic-btn{width:36px;height:36px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:3px;transition:background .2s;flex-shrink:0}',
    '.bw-send-btn{background:#D72B2B;color:#fff}',
    '.bw-send-btn:hover{background:#a81f1f}',
    '.bw-mic-btn{background:#2a2a2a;color:#8a8a8a;border:1px solid #3a3a3a}',
    '.bw-mic-btn:hover{background:#3a3a3a;color:#f5f5f5}',
    '.bw-mic-btn.listening{background:rgba(215,43,43,.2);border-color:#D72B2B;color:#D72B2B;animation:bwMicPulse 1s infinite}',
    '@keyframes bwMicPulse{0%,100%{box-shadow:0 0 0 0 rgba(215,43,43,.4)}50%{box-shadow:0 0 0 6px rgba(215,43,43,0)}}',
    '.bw-voice-hint{font-size:.68rem;color:#8a8a8a;text-align:center;margin-top:.35rem}',
    '.bw-quick-btns{display:flex;flex-wrap:wrap;gap:.4rem;padding:.5rem 1rem 0}',
    '.bw-quick-btn{background:#2a2a2a;border:1px solid #3a3a3a;color:#e8e8e8;padding:.35rem .7rem;border-radius:20px;font-size:.75rem;cursor:pointer;transition:all .2s;font-family:"Barlow",sans-serif}',
    '.bw-quick-btn:hover{background:#D72B2B;border-color:#D72B2B;color:#fff}',
    '@media(max-width:480px){#bw-chat-window{width:calc(100vw - 2rem);height:70vh;right:0;bottom:0;border-radius:6px 6px 0 0}#bw-chat-widget{right:1rem;bottom:1rem}}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* --- Build chatbot HTML --- */
  var widget = document.getElementById('bw-chat-widget');
  widget.innerHTML = [
    '<div id="bw-chat-window">',
    '  <div class="bw-header">',
    '    <div class="bw-header-left">',
    '      <div class="bw-avatar">\uD83D\uDD27</div>',
    '      <div><div class="bw-name">B&amp;W Auto Assistant</div><div class="bw-status">\u25CF Online now</div></div>',
    '    </div>',
    '    <button class="bw-close" id="bw-close-btn">\u2715</button>',
    '  </div>',
    '  <div class="bw-messages" id="bw-messages"></div>',
    '  <div class="bw-quick-btns" id="bw-quick-btns">',
    '    <button class="bw-quick-btn" data-q="What are your hours?">Hours</button>',
    '    <button class="bw-quick-btn" data-q="Where are you located?">Location</button>',
    '    <button class="bw-quick-btn" data-q="What services do you offer?">Services</button>',
    '    <button class="bw-quick-btn" data-q="I need to book an appointment">Appointment</button>',
    '    <button class="bw-quick-btn" data-q="Do you speak Spanish?">Espa\u00f1ol?</button>',
    '  </div>',
    '  <div class="bw-input-area">',
    '    <div class="bw-input-row">',
    '      <textarea id="bw-input" placeholder="Ask about services, hours, location..." rows="1"></textarea>',
    '      <button class="bw-mic-btn" id="bw-mic-btn"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zm6.4 9a6.4 6.4 0 0 1-12.8 0H4a8 8 0 0 0 7.5 7.94V21h1v-2.06A8 8 0 0 0 20 11h-1.6z"/></svg></button>',
    '      <button class="bw-send-btn" id="bw-send-btn"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>',
    '    </div>',
    '    <div class="bw-voice-hint" id="bw-voice-hint">\uD83C\uDFA4 Click mic to speak</div>',
    '  </div>',
    '</div>',
    '<button id="bw-chat-bubble"><div class="bw-pulse"></div><svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></button>'
  ].join('\n');

  /* --- State --- */
  var isOpen = false;
  var greeted = false;
  var listening = false;
  var rec = null;

  /* --- Knowledge Base (no server needed) --- */
  var KB = {
    hours: {
      en: "Our hours are:\n\u2022 Monday \u2013 Friday: 8am \u2013 6pm\n\u2022 Saturday: 8am \u2013 4pm\n\u2022 Sunday: Closed\n\nNeed to schedule a visit? Just scroll up to our appointment form or call us at 609.362.5476!",
      es: "Nuestro horario es:\n\u2022 Lunes \u2013 Viernes: 8am \u2013 6pm\n\u2022 S\u00e1bado: 8am \u2013 4pm\n\u2022 Domingo: Cerrado\n\n\u00bfNecesita programar una visita? \u00a1Suba al formulario de citas o ll\u00e1menos al 609.362.5476!"
    },
    location: {
      en: "We\u2019re located at 843 Route 33 West, Monroe Township, NJ 08831. We\u2019re easy to find right on Route 33! Come visit us anytime during business hours.",
      es: "Estamos ubicados en 843 Route 33 West, Monroe Township, NJ 08831. \u00a1Somos f\u00e1ciles de encontrar en la Ruta 33! Vis\u00edtenos en horario de atenci\u00f3n."
    },
    services: {
      en: "We offer a full range of auto repair services:\n\u2022 Auto Repair (engine, transmission, diagnostics)\n\u2022 Maintenance (oil changes, tune-ups, fluid checks)\n\u2022 Brakes (pads, rotors, calipers)\n\u2022 Electrical (batteries, alternators, wiring)\n\u2022 Exhaust (mufflers, catalytic converters)\n\u2022 A/C (diagnostics, recharge, repair)\n\u2022 Suspension (shocks, struts, alignment)\n\u2022 Welding Services\n\u2022 Tire Repair & Rotation\n\nWant to book a service? Use the appointment form above or call 609.362.5476!",
      es: "Ofrecemos una gama completa de servicios de reparaci\u00f3n automotriz:\n\u2022 Reparaci\u00f3n Automotriz (motor, transmisi\u00f3n, diagn\u00f3stico)\n\u2022 Mantenimiento (cambios de aceite, afinaciones)\n\u2022 Frenos (pastillas, rotores, calibradores)\n\u2022 El\u00e9ctrico (bater\u00edas, alternadores, cableado)\n\u2022 Escape (silenciadores, convertidores catal\u00edticos)\n\u2022 Aire Acondicionado\n\u2022 Suspensi\u00f3n (amortiguadores, alineaci\u00f3n)\n\u2022 Servicios de Soldadura\n\u2022 Reparaci\u00f3n y Rotaci\u00f3n de Llantas\n\n\u00bfDesea agendar un servicio? \u00a1Use el formulario de citas arriba o llame al 609.362.5476!"
    },
    appointment: {
      en: "You can request an appointment right here on our website! Just scroll up to the \u201cMake Your Appointment Today\u201d section and fill out the form. Or call us directly at 609.362.5476 \u2014 we\u2019ll get you scheduled right away!",
      es: "\u00a1Puede solicitar una cita aqu\u00ed mismo en nuestro sitio web! Suba a la secci\u00f3n \u201cHaga Su Cita Hoy\u201d y complete el formulario. O ll\u00e1menos directamente al 609.362.5476 \u2014 \u00a1lo programaremos de inmediato!"
    },
    spanish: {
      en: "\u00a1S\u00ed, hablamos Espa\u00f1ol! Our team is fully bilingual. Feel free to communicate in Spanish \u2014 we\u2019re here to help in whichever language you prefer. \u00bfEn qu\u00e9 podemos ayudarle?",
      es: "\u00a1S\u00ed, hablamos Espa\u00f1ol! Nuestro equipo es completamente biling\u00fce. Si\u00e9ntase libre de comunicarse en espa\u00f1ol \u2014 estamos aqu\u00ed para ayudarle. \u00bfEn qu\u00e9 podemos ayudarle?"
    },
    phone: {
      en: "You can reach us at 609.362.5476. We\u2019re available Monday\u2013Friday 8am\u20136pm and Saturday 8am\u20134pm. We look forward to hearing from you!",
      es: "Puede comunicarse con nosotros al 609.362.5476. Estamos disponibles de lunes a viernes de 8am a 6pm y s\u00e1bados de 8am a 4pm. \u00a1Esperamos su llamada!"
    },
    payment: {
      en: "You can pay your invoice conveniently online! Scroll down to our \u201cPay Your Invoice\u201d section on this page. You can also pay by phone \u2014 just call us at 609.362.5476.",
      es: "\u00a1Puede pagar su factura c\u00f3modamente en l\u00ednea! Baje a la secci\u00f3n \u201cPague Su Factura\u201d en esta p\u00e1gina. Tambi\u00e9n puede pagar por tel\u00e9fono \u2014 ll\u00e1menos al 609.362.5476."
    },
    pricing: {
      en: "Our pricing is always fair and transparent \u2014 no hidden fees! The cost depends on the specific service your vehicle needs. Call us at 609.362.5476 or book an appointment for a free estimate.",
      es: "Nuestros precios son siempre justos y transparentes \u2014 \u00a1sin cargos ocultos! El costo depende del servicio espec\u00edfico que necesite su veh\u00edculo. Ll\u00e1menos al 609.362.5476 o agende una cita para un presupuesto gratuito."
    },
    oil: {
      en: "Yes, we do oil changes! Regular oil changes are essential for your engine\u2019s health. We handle conventional, synthetic blend, and full synthetic oil changes. Book an appointment or call 609.362.5476!",
      es: "\u00a1S\u00ed, hacemos cambios de aceite! Los cambios regulares son esenciales para la salud de su motor. Manejamos aceite convencional, semi-sint\u00e9tico y sint\u00e9tico completo. \u00a1Agende una cita o llame al 609.362.5476!"
    },
    brakes: {
      en: "We\u2019re brake experts! We handle brake pads, rotors, calipers, brake fluid, and complete brake system service. If you hear squeaking or feel vibration when braking, come see us right away. Call 609.362.5476!",
      es: "\u00a1Somos expertos en frenos! Manejamos pastillas, rotores, calibradores, l\u00edquido de frenos y servicio completo del sistema de frenos. Si escucha chirridos o siente vibraci\u00f3n al frenar, \u00a1venga a vernos! Llame al 609.362.5476."
    },
    tires: {
      en: "We offer tire repair, rotation, balancing, and replacement. Keeping your tires in good condition is crucial for safety. Come in for a check or call us at 609.362.5476!",
      es: "\u00a1Ofrecemos reparaci\u00f3n, rotaci\u00f3n, balanceo y reemplazo de llantas! Mantener sus llantas en buena condici\u00f3n es crucial para la seguridad. \u00a1Venga para una revisi\u00f3n o ll\u00e1menos al 609.362.5476!"
    },
    engine: {
      en: "We handle all engine repairs \u2014 from diagnostics to complete rebuilds. Check engine light on? Bring it in and we\u2019ll diagnose it. Call 609.362.5476 to schedule!",
      es: "Manejamos todas las reparaciones de motor \u2014 desde diagn\u00f3sticos hasta reconstrucciones completas. \u00bfSe encendi\u00f3 la luz del motor? Tr\u00e1igalo y lo diagnosticaremos. \u00a1Llame al 609.362.5476!"
    },
    transmission: {
      en: "Yes, we service transmissions! Whether it\u2019s a fluid change, repair, or rebuild, our experienced mechanics can handle it. Call us at 609.362.5476 for a consultation.",
      es: "\u00a1S\u00ed, damos servicio a transmisiones! Ya sea cambio de fluido, reparaci\u00f3n o reconstrucci\u00f3n, nuestros mec\u00e1nicos experimentados pueden manejarlo. Llame al 609.362.5476 para una consulta."
    },
    ac: {
      en: "We provide full A/C service \u2014 diagnostics, recharge, and repair. Stay cool and comfortable! Schedule a visit or call 609.362.5476.",
      es: "Ofrecemos servicio completo de aire acondicionado \u2014 diagn\u00f3stico, recarga y reparaci\u00f3n. \u00a1Mant\u00e9ngase fresco y c\u00f3modo! Agende una visita o llame al 609.362.5476."
    },
    welding: {
      en: "We offer professional welding services for exhaust systems, frames, brackets, and custom fabrication. Call 609.362.5476 to discuss your welding needs!",
      es: "Ofrecemos servicios profesionales de soldadura para sistemas de escape, marcos, soportes y fabricaci\u00f3n personalizada. \u00a1Llame al 609.362.5476 para discutir sus necesidades de soldadura!"
    },
    default: {
      en: "Thanks for reaching out! For the best assistance, please call us directly at 609.362.5476 or use the appointment form above. We\u2019re happy to help with any auto repair needs!",
      es: "\u00a1Gracias por contactarnos! Para la mejor asistencia, ll\u00e1menos directamente al 609.362.5476 o use el formulario de citas arriba. \u00a1Estamos felices de ayudarle con cualquier necesidad de reparaci\u00f3n automotriz!"
    }
  };

  /* --- Detect language of input --- */
  function detectLang(text) {
    var spanishWords = ['hola', 'necesito', 'quiero', 'donde', 'dónde', 'cuándo', 'cuanto', 'cuánto', 'horario', 'cita', 'servicio', 'reparación', 'frenos', 'aceite', 'llantas', 'español', 'gracias', 'ayuda', 'precio', 'pagar', 'factura', 'ubicación', 'abierto', 'cerrado', 'motor', 'transmisión', 'soldadura', 'escape', 'suspensión', 'aire', 'acondicionado', 'buenos', 'días', 'buenas', 'tardes', 'noches', 'por favor', 'tienen', 'hacen', 'pueden', 'cómo'];
    var lower = text.toLowerCase();
    for (var i = 0; i < spanishWords.length; i++) {
      if (lower.indexOf(spanishWords[i]) !== -1) return 'es';
    }
    return 'en';
  }

  /* --- Match user input to KB --- */
  function getResponse(text) {
    var lang = detectLang(text);
    var lower = text.toLowerCase();

    // Keywords mapping
    var patterns = [
      { keys: ['hour', 'open', 'close', 'when', 'time', 'schedule', 'horario', 'abierto', 'cerrado', 'cuándo', 'cuando'], topic: 'hours' },
      { keys: ['where', 'location', 'address', 'direction', 'find', 'map', 'donde', 'dónde', 'ubicación', 'dirección', 'cómo llego'], topic: 'location' },
      { keys: ['service', 'offer', 'what do you', 'what can', 'servicio', 'ofrecen', 'qué hacen', 'que hacen'], topic: 'services' },
      { keys: ['appointment', 'book', 'schedule', 'cita', 'agendar', 'reservar', 'programar'], topic: 'appointment' },
      { keys: ['spanish', 'español', 'espanol', 'hablan', 'bilingual', 'bilingüe'], topic: 'spanish' },
      { keys: ['phone', 'call', 'number', 'teléfono', 'telefono', 'llamar', 'número', 'numero', 'contact'], topic: 'phone' },
      { keys: ['pay', 'payment', 'invoice', 'bill', 'pagar', 'pago', 'factura', 'cuenta'], topic: 'payment' },
      { keys: ['price', 'cost', 'how much', 'estimate', 'quote', 'precio', 'costo', 'cuánto', 'cuanto', 'presupuesto', 'cotización'], topic: 'pricing' },
      { keys: ['oil', 'aceite', 'cambio de aceite'], topic: 'oil' },
      { keys: ['brake', 'freno', 'squeaking', 'squeak', 'chirri'], topic: 'brakes' },
      { keys: ['tire', 'llanta', 'flat', 'rotation', 'rotación', 'ponchadura', 'balanceo'], topic: 'tires' },
      { keys: ['engine', 'motor', 'check engine', 'luz del motor'], topic: 'engine' },
      { keys: ['transmission', 'transmisión', 'transmision'], topic: 'transmission' },
      { keys: ['a/c', 'air condition', 'ac ', 'aire acondicionado', 'aire'], topic: 'ac' },
      { keys: ['weld', 'soldadura', 'soldar'], topic: 'welding' }
    ];

    for (var i = 0; i < patterns.length; i++) {
      var p = patterns[i];
      for (var j = 0; j < p.keys.length; j++) {
        if (lower.indexOf(p.keys[j]) !== -1) {
          return KB[p.topic][lang];
        }
      }
    }

    // Greeting detection
    var greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'hola', 'buenos', 'buenas', 'saludos', 'qué tal', 'que tal'];
    for (var g = 0; g < greetings.length; g++) {
      if (lower.indexOf(greetings[g]) !== -1) {
        if (lang === 'es') {
          return '\u00a1Hola! Bienvenido a B&W Auto Repair. \u00bfEn qu\u00e9 podemos ayudarle hoy? Puede preguntarnos sobre nuestros servicios, horario, ubicaci\u00f3n, o agendar una cita.';
        }
        return 'Hello! Welcome to B&W Auto Repair. How can we help you today? You can ask about our services, hours, location, or schedule an appointment.';
      }
    }

    // Thank you detection
    var thanks = ['thank', 'thanks', 'gracias', 'appreciate'];
    for (var t = 0; t < thanks.length; t++) {
      if (lower.indexOf(thanks[t]) !== -1) {
        if (lang === 'es') {
          return '\u00a1De nada! Estamos aqu\u00ed para ayudarle. Si necesita algo m\u00e1s, no dude en preguntar o ll\u00e1menos al 609.362.5476.';
        }
        return 'You\u2019re welcome! We\u2019re here to help. If you need anything else, don\u2019t hesitate to ask or call us at 609.362.5476.';
      }
    }

    return KB['default'][lang];
  }

  /* --- Render message --- */
  function renderMsg(role, text) {
    var container = document.getElementById('bw-messages');
    var el = document.createElement('div');
    el.className = 'bw-msg ' + role;
    var now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Convert newlines to <br>
    var html = text.replace(/\n/g, '<br>');
    el.innerHTML = '<div class="bw-bubble">' + html + '</div><div class="bw-time">' + now + '</div>';
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    var container = document.getElementById('bw-messages');
    var el = document.createElement('div');
    el.id = 'bw-typing';
    el.className = 'bw-msg bot';
    el.innerHTML = '<div class="bw-typing"><div class="bw-dot"></div><div class="bw-dot"></div><div class="bw-dot"></div></div>';
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function removeTyping() {
    var t = document.getElementById('bw-typing');
    if (t) t.remove();
  }

  /* --- Toggle chat --- */
  function toggle() {
    isOpen = !isOpen;
    document.getElementById('bw-chat-window').classList.toggle('bw-open', isOpen);
    if (isOpen && !greeted) {
      greeted = true;
      setTimeout(function () {
        renderMsg('bot', '\u00a1Hola! Hey there! This is B&W Auto Repair \u2014 how can we help you with your vehicle today? \uD83D\uDD27');
      }, 350);
    }
  }

  /* --- Send message --- */
  function send(textOverride) {
    var input = document.getElementById('bw-input');
    var text = textOverride || input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';

    // Hide quick buttons after first message
    var qb = document.getElementById('bw-quick-btns');
    if (qb) qb.style.display = 'none';

    renderMsg('user', text);
    showTyping();

    // Simulate brief thinking delay
    var delay = 600 + Math.random() * 800;
    setTimeout(function () {
      removeTyping();
      var response = getResponse(text);
      renderMsg('bot', response);
    }, delay);
  }

  /* --- Voice input --- */
  function toggleVoice() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      document.getElementById('bw-voice-hint').textContent = '\u26A0\uFE0F Not supported';
      return;
    }
    if (listening) {
      rec.stop();
      return;
    }
    rec = new SR();
    rec.onstart = function () {
      listening = true;
      document.getElementById('bw-mic-btn').classList.add('listening');
      document.getElementById('bw-voice-hint').textContent = '\uD83D\uDD34 Listening...';
    };
    rec.onresult = function (e) {
      send(e.results[0][0].transcript);
    };
    rec.onend = function () {
      listening = false;
      document.getElementById('bw-mic-btn').classList.remove('listening');
      document.getElementById('bw-voice-hint').textContent = '\uD83C\uDFA4 Click mic to speak';
    };
    rec.start();
  }

  /* --- Event listeners --- */
  document.getElementById('bw-chat-bubble').addEventListener('click', toggle);
  document.getElementById('bw-close-btn').addEventListener('click', toggle);
  document.getElementById('bw-send-btn').addEventListener('click', function () { send(); });
  document.getElementById('bw-mic-btn').addEventListener('click', toggleVoice);

  document.getElementById('bw-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  document.getElementById('bw-input').addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 90) + 'px';
  });

  // Quick buttons
  document.querySelectorAll('.bw-quick-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      send(this.getAttribute('data-q'));
    });
  });

})();
