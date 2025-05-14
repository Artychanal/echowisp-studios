// === script.js ===

let translations = {};

function switchLanguage() {
  const lang = document.getElementById('language-switcher').value;
  fetch(`lang/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      translations = data;
      const elements = document.querySelectorAll('[data-lang]');
      elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[key]) {
          el.textContent = translations[key];
        }
      });
    });
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// === IntersectionObserver for appearance animation ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2
});

window.addEventListener('DOMContentLoaded', () => {
  switchLanguage();

  // Observe key sections
  const animatedElements = document.querySelectorAll('.section, .card, .slide');
  animatedElements.forEach(el => observer.observe(el));

  // Observe all elements (for scroll-in animation)
  const appearObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        appearObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });
  document.querySelectorAll("body *:not(script):not(style)").forEach(el => el.classList.add("observe-animate"));
  document.querySelectorAll(".observe-animate").forEach(el => appearObserver.observe(el));
});

// === Canvas stars in project section ===
const canvas = document.getElementById('projectCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector('#project').offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random()
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(173, 216, 255, ${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// === Particle dots floating in background ===
const particleContainer = document.querySelector('.glow-particles');
const dots = [];
for (let i = 0; i < 30; i++) {
  const dot = document.createElement('span');
  dot.style.position = "absolute";
  dot.style.left = `${Math.random() * 100}vw`;
  dot.style.top = `${Math.random() * 100}vh`;
  dot.style.width = `${Math.random() * 4 + 2}px`;
  dot.style.height = dot.style.width;
  dot.style.background = "rgba(187, 136, 255, 0.3)";
  dot.style.borderRadius = "50%";
  dot.style.animation = `floatParticle ${6 + Math.random() * 6}s linear infinite`;
  dot.style.transition = "transform 0.2s ease";
  particleContainer.appendChild(dot);
  dots.push(dot);
}

document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  dots.forEach((dot) => {
    const rect = dot.getBoundingClientRect();
    const dotX = rect.left + rect.width / 2;
    const dotY = rect.top + rect.height / 2;
    const dx = x - dotX;
    const dy = y - dotY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const strength = Math.max(0, 100 - dist) / 5;
    const offsetX = -(dx / dist) * strength;
    const offsetY = -(dy / dist) * strength;
    if (dist < 100) {
      dot.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    } else {
      dot.style.transform = "translate(0, 0)";
    }
  });
});

// === Contact Orb ===
const orb = document.querySelector(".contact-orb");
document.querySelector("#contact").addEventListener("mousemove", (e) => {
  const bounds = e.currentTarget.getBoundingClientRect();
  const offsetX = e.clientX - bounds.left - bounds.width / 2;
  const offsetY = e.clientY - bounds.top - bounds.height / 2;
  orb.classList.add("follow");
  orb.style.transform = `translateX(50%) translate(${offsetX * 0.02}px, ${offsetY * 0.02}px)`;
});

document.querySelector("#contact").addEventListener("mouseleave", () => {
  orb.style.transform = "translateX(50%)";
  orb.classList.remove("follow");
});

document.querySelectorAll(".contact-form input, .contact-form textarea").forEach((el) => {
  el.addEventListener("focus", () => orb.classList.add("active"));
  el.addEventListener("blur", () => orb.classList.remove("active"));
});