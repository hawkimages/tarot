const imageCount = 78;
const imageFolder = 'tarotcards/';
const imageExtension = '.jpg';
const maxCards = 13;
const container = document.getElementById('card-container');
const addBtn = document.getElementById('redraw');
const removeBtn = document.getElementById('remove-card');

function getRandomImagePath() {
  const n = Math.floor(Math.random() * imageCount) + 1;
  return `${imageFolder}${n}${imageExtension}`;
}

function randomizeCardImage(card) {
  const img = card.querySelector('img');
  if (img) img.src = getRandomImagePath();
}

function arrangeCards() {
  const cards = container.querySelectorAll('.card');
  const n = cards.length;
  const radius = 220;
  if (n === 1) {
    cards[0].style.transform = 'translate(-50%, -50%)';
    cards[0].style.zIndex = 2;
    return;
  }
  if (n === 13) {
    cards[0].style.transform = 'translate(-50%, -50%)';
    cards[0].style.zIndex = 2;
    for (let i = 1; i < n; i++) {
      let angle = ((i - 1) / 12) * 2 * Math.PI;
      cards[i].style.transform = `translate(-50%, -50%) translate(${Math.cos(angle - Math.PI/2) * radius}px, ${Math.sin(angle - Math.PI/2) * radius}px)`;
      cards[i].style.zIndex = 1;
    }
  } else {
    for (let i = 0; i < n; i++) {
      let angle = (i / n) * 2 * Math.PI;
      cards[i].style.transform = `translate(-50%, -50%) translate(${Math.cos(angle - Math.PI/2) * radius}px, ${Math.sin(angle - Math.PI/2) * radius}px)`;
      cards[i].style.zIndex = 1;
    }
  }
}

// 3D rotation and lighting (applies only to the first card)
const card = document.querySelector('.card');
const cardLight = document.querySelector('.card-light');
let startX, startY, currentX = 0, currentY = 0, rotating = false;

function setCardRotation(x, y) {
  card.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  updateCardLighting(x, y);
}

function updateCardLighting(x, y) {
  const normY = Math.max(-45, Math.min(45, x)) / 45;
  const normX = Math.max(-45, Math.min(45, y)) / 45;
  const lightStrength = Math.max(0, normY) * 0.6 + Math.max(0, normX) * 0.4;
  const shadowStrength = Math.abs(Math.min(0, normY)) * 0.6 + Math.abs(Math.min(0, normX)) * 0.4;
  const lightColor = `rgba(255,255,255,${0.18 + 0.38 * lightStrength})`;
  const shadowColor = `rgba(30,40,80,${0.18 + 0.38 * shadowStrength})`;
  const lightAngle = 45 + normX * 25 - normY * 25;
  cardLight.style.background = `
    linear-gradient(${-lightAngle}deg, ${lightColor} 0%, transparent 60%),
    linear-gradient(${-lightAngle}deg, ${shadowColor} 30%, transparent 60%)
  `;
}

function onPointerDown(e) {
  rotating = true;
  card.classList.add('active');
  startX = (e.touches ? e.touches[0].clientX : e.clientX) - currentX;
  startY = (e.touches ? e.touches[0].clientY : e.clientY) - currentY;
  document.body.style.userSelect = "none";
}

function onPointerMove(e) {
  if (!rotating) return;
  let moveX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
  let moveY = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
  currentX = Math.max(-45, Math.min(45, moveX/2));
  currentY = Math.max(-45, Math.min(45, moveY/2));
  setCardRotation(currentX, currentY);
}

function onPointerUp() {
  rotating = false;
  card.classList.remove('active');
  document.body.style.userSelect = "";
  card.style.transition = "transform 0.6s cubic-bezier(.58,.02,.25,1)";
  currentX = 0;
  currentY = 0;
  setCardRotation(0, 0);
  setTimeout(()=>card.style.transition = "", 700);
}

// Events for 3D interaction
card.addEventListener('mousedown', onPointerDown);
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('mouseup', onPointerUp);
card.addEventListener('touchstart', onPointerDown, {passive:false});
window.addEventListener('touchmove', onPointerMove, {passive:false});
window.addEventListener('touchend', onPointerUp);

window.addEventListener('DOMContentLoaded', () => {
  card.querySelector('img').src = getRandomImagePath();
  setCardRotation(0, 0);
  arrangeCards();
});

// Add card
addBtn.addEventListener('click', () => {
  const currentCards = container.querySelectorAll('.card').length;
  if (currentCards >= maxCards) return;
  const newCard = card.cloneNode(true);
  randomizeCardImage(newCard);
  container.appendChild(newCard);
  arrangeCards();
});

// Remove card (LIFO, keeps at least one)
removeBtn.addEventListener('click', () => {
  const cards = container.querySelectorAll('.card');
  if (cards.length > 1) {
    container.removeChild(cards[cards.length - 1]);
    arrangeCards();
  }
});