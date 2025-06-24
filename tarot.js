const card = document.querySelector('.card');

let startX, startY, currentX = 0, currentY = 0, rotating = false;

function setCardRotation(x, y) {
  card.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
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
  // Animate back to original
  card.style.transition = "transform 0.6s cubic-bezier(.58,.02,.25,1)";
  currentX = 0;
  currentY = 0;
  setCardRotation(0, 0);
  setTimeout(()=>card.style.transition = "", 700);
}

// Mouse
card.addEventListener('mousedown', onPointerDown);
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('mouseup', onPointerUp);

// Touch
card.addEventListener('touchstart', onPointerDown, {passive:false});
window.addEventListener('touchmove', onPointerMove, {passive:false});
window.addEventListener('touchend', onPointerUp);

setCardRotation(0, 0);



const imageCount = 78; // Number of images
const imageFolder = 'tarotcards/';
const imageExtension = '.jpg';

function getRandomImagePath() {
  const randomNum = Math.floor(Math.random() * imageCount) + 1;
  return `${imageFolder}${randomNum}${imageExtension}`;
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('image').src = getRandomImagePath();
});