const loginForm = document.querySelector('#login-form');
const dashboard = document.querySelector('#dashboard');
const loginCard = document.querySelector('.login-card');
const status = document.querySelector('#login-status');
const heading = document.querySelector('#student-heading');
const advisory = document.querySelector('#advisory-modal');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const name = String(data.get('name')).trim();
  const school = String(data.get('school')).trim();
  const email = String(data.get('email')).trim();
  if (!name || !school || !email) return;
  // Fixture-only checkpoint: real roster/API verification comes after the class gate.
  heading.textContent = `Halo, ${name}`;
  status.textContent = `Fixture lokal aktif untuk ${school}. Verifikasi roster backend belum dilakukan.`;
  status.style.color = '#027a48';
  loginCard.hidden = true;
  dashboard.hidden = false;
});

document.querySelector('#logout-button').addEventListener('click', () => {
  dashboard.hidden = true;
  loginCard.hidden = false;
  loginForm.reset();
  status.textContent = '';
});

document.querySelector('#open-advisory').addEventListener('click', () => advisory.showModal());
document.querySelector('#dismiss-advisory').addEventListener('click', () => advisory.close());
