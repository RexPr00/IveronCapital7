const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapFocus(container, event) {
  const nodes = Array.from(container.querySelectorAll(focusableSelectors));
  if (!nodes.length || event.key !== 'Tab') return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.querySelectorAll('[data-dropdown]').forEach((dropdown) => {
  const button = dropdown.querySelector('button');
  button.addEventListener('click', () => {
    const open = dropdown.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
});

document.addEventListener('click', (e) => {
  document.querySelectorAll('[data-dropdown]').forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      const button = dropdown.querySelector('button');
      if (button) button.setAttribute('aria-expanded', 'false');
    }
  });
});

const drawer = document.querySelector('.drawer');
const drawerPanel = document.querySelector('.drawer-panel');
const burger = document.querySelector('.burger');
const closeDrawerBtn = document.querySelector('.drawer-close');

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
  burger?.setAttribute('aria-expanded', 'false');
}

burger?.addEventListener('click', () => {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  burger.setAttribute('aria-expanded', 'true');
  closeDrawerBtn?.focus();
});
closeDrawerBtn?.addEventListener('click', closeDrawer);
drawer?.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    closeModal();
  }
  if (drawer?.classList.contains('open')) trapFocus(drawerPanel, e);
  if (modal?.classList.contains('open')) trapFocus(modalPanel, e);
});

const amountButtons = document.querySelectorAll('.segment');
const monthInput = document.querySelector('.months');
const monthValue = document.querySelector('.months-value');
const values = document.querySelectorAll('.value');
let amount = 50000;
let months = 12;

function formatCurrency(num) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

function updateCalc() {
  const low = amount * Math.pow(1.08, months / 1);
  const base = amount * Math.pow(1.11, months / 1);
  const high = amount * Math.pow(1.14, months / 1);
  if (values[0]) values[0].textContent = formatCurrency(low);
  if (values[1]) values[1].textContent = formatCurrency(base);
  if (values[2]) values[2].textContent = formatCurrency(high);
  if (monthValue) monthValue.textContent = `${months} months`;
}

amountButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    amountButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    amount = Number(btn.dataset.amount);
    updateCalc();
  });
});
monthInput?.addEventListener('input', (e) => {
  months = Number(e.target.value);
  updateCalc();
});
updateCalc();

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const q = item.querySelector('.faq-question');
  q.addEventListener('click', () => {
    faqItems.forEach((other) => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      }
    });
    const open = item.classList.toggle('open');
    q.setAttribute('aria-expanded', String(open));
  });
});

const modal = document.querySelector('[data-modal]');
const modalPanel = document.querySelector('.modal-panel');
const openModalBtn = document.querySelector('[data-modal-open]');
const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
}

openModalBtn?.addEventListener('click', () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  modal.querySelector('.modal-x')?.focus();
});
modalCloseButtons.forEach((btn) => btn.addEventListener('click', closeModal));
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.15 });

document.querySelectorAll('section').forEach((section) => {
  section.classList.add('reveal');
  observer.observe(section);
});
