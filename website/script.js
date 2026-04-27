// Shared JS for all pages

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('up'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── NAVBAR SCROLL ──
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) nav.style.borderBottomColor = window.scrollY > 10 ? 'rgba(0,0,0,0.1)' : 'transparent';
});

// ── ACTIVE NAV LINK (highlight current page) ──
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
    a.classList.add('active');
    a.style.color = '#1d1d1f';
  }
});

// ── DEMO CHAT SCENARIOS ──
const scenarios = {
  fever: {
    wa: [
      { t:'user', m:'I have fever and headache for 2 days.' },
      { t:'bot',  m:'🔎 Symptom Analysis\n\n• Take Paracetamol 500mg\n• Stay hydrated — drink fluids\n• Apply cool compress on forehead\n\n⚠️ See a doctor if:\n→ Fever > 103°F (39.4°C)\n→ Symptoms last 3+ days\n→ Difficulty breathing' }
    ],
    voice: 'You have reported fever and headache for two days. Please take paracetamol, rest, and drink plenty of fluids. If your temperature goes above 103 degrees or symptoms worsen after three days, please consult a doctor immediately.',
    label: '🤒 Fever',
    status: '🔎 Analyzing symptoms…'
  },
  emergency: {
    wa: [
      { t:'user', m:'My father has severe chest pain and is sweating heavily.' },
      { t:'bot',  m:'🚨 EMERGENCY DETECTED 🚨\n\n1️⃣ CALL 108 IMMEDIATELY\n2️⃣ Sit him upright — don\'t lay flat\n3️⃣ No food or water\n4️⃣ Loosen tight clothing\n5️⃣ Stay on the line with 108\n\n⚡ Possible cardiac event detected\n\nShare your GPS → I\'ll find nearest hospital.' }
    ],
    voice: 'Medical emergency detected. Your father may be experiencing a cardiac event. Call one-zero-eight immediately. Keep him sitting upright, do not give food or water, and loosen any tight clothing. Stay calm and follow emergency services instructions.',
    label: '🚨 Emergency',
    status: '🚨 Emergency protocol triggered'
  },
  vaccine: {
    wa: [
      { t:'user', m:'Vaccine schedule for baby born on January 10, 2025' },
      { t:'bot',  m:'💉 Vaccination Schedule\nDOB: January 10, 2025\n\n✅ At Birth → BCG, OPV-0, Hep-B\n✅ 6 weeks → DTwP, IPV, Hib, PCV\n📅 Next Due: April 21, 2025\n\nWould you like a WhatsApp reminder?' }
    ],
    voice: 'For your baby born January 10th 2025, vaccinations at birth are complete. The next dose is due April 21st 2025 and includes DTwP, IPV, Hib, and PCV. Shall I set a reminder for you?',
    label: '💉 Vaccine',
    status: '💉 Calculating schedule…'
  }
};

function runDemo(key) {
  const s = scenarios[key];
  if (!s) return;

  const chat = document.getElementById('demo-chat');
  const vstatus = document.getElementById('v-status');
  const vtrans = document.getElementById('v-transcript');
  if (!chat) return;

  chat.innerHTML = '';
  if (vstatus) vstatus.textContent = s.status;
  if (vtrans) vtrans.textContent = '';

  s.wa.forEach((msg, i) => {
    setTimeout(() => {
      const row = document.createElement('div');
      row.style.cssText = `display:flex;justify-content:${msg.t==='user'?'flex-end':'flex-start'};margin-bottom:.6rem;opacity:0;transform:translateY(6px);transition:all .35s ease`;
      const bbl = document.createElement('div');
      bbl.className = `bubble bubble-${msg.t}`;
      bbl.style.whiteSpace = 'pre-wrap';
      bbl.textContent = msg.m;
      row.appendChild(bbl);
      chat.appendChild(row);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        row.style.opacity = '1'; row.style.transform = 'none';
      }));
      chat.scrollTop = chat.scrollHeight;
    }, i * 1000);
  });

  if (vtrans) {
    setTimeout(() => {
      const words = s.voice.split(' ');
      let i = 0;
      const iv = setInterval(() => {
        if (i < words.length) vtrans.textContent += words[i++] + ' ';
        else { clearInterval(iv); if (vstatus) vstatus.textContent = '✅ Response complete'; }
      }, 80);
    }, 500);
  }
}

// Init demo on pages that have it
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      runDemo(btn.dataset.key);
    });
  });
  const first = document.querySelector('.scenario-btn');
  if (first) { first.classList.add('active'); runDemo(first.dataset.key); }
});
