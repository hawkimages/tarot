
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

// Refresh page when "redraw" button is clicked //


const card = document.querySelector('.card');
const cardLight = document.querySelector('.card-light');

let startX, startY, currentX = 0, currentY = 0, rotating = false;

function setCardRotation(x, y) {
  card.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  updateCardLighting(x, y);
}

function updateCardLighting(x, y) {
  // x is rotateY (left/right), y is rotateX (up/down)
  // We'll map x and y in [-45, 45] to a percentage
  const normY = Math.max(-45, Math.min(45, x)) / 45; // -1 to 1
  const normX = Math.max(-45, Math.min(45, y)) / 45; // -1 to 1

  // Calculate light and shadow intensity
  const lightStrength = Math.max(0, normY) * 0.6 + Math.max(0, normX) * 0.4;  // light from top/right
  const shadowStrength = Math.abs(Math.min(0, normY)) * 0.6 + Math.abs(Math.min(0, normX)) * 0.4; // shadow from bottom/left

  // Light color: a subtle warm white
  const lightColor = `rgba(255,255,255,${0.18 + 0.38 * lightStrength})`;
  // Shadow color: a bluish/dark shade
  const shadowColor = `rgba(30,40,80,${0.18 + 0.38 * shadowStrength})`;

  // Angle: Light from top right, shadow from bottom left
  const lightAngle = 45 + normX * 25 - normY * 25; // tweak for realism

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




