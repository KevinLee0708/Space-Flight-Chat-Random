let items = [];
let startAngle = 0;
let arc;

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const colors = [
  "#ff6b6b","#ffd93d","#6bcB77","#4d96ff",
  "#c77dff","#ff922b","#20c997","#f06595"
];

// 📦 JSON 로드
fetch("Item.json?v=" + Date.now())
  .then(res => res.json())
  .then(data => {
    items = data.items;
    arc = Math.PI * 2 / items.length;
    drawWheel();
  });

function drawWheel() {
  const radius = 180;

  ctx.clearRect(0, 0, 400, 400);

  for (let i = 0; i < items.length; i++) {
    const angle = startAngle + i * arc;

    // 🌈 알록달록 색상
    ctx.fillStyle = colors[i % colors.length];

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, radius, angle, angle + arc);
    ctx.fill();

    // 텍스트
    ctx.save();
    ctx.fillStyle = "white";
    ctx.translate(
      200 + Math.cos(angle + arc / 2) * 120,
      200 + Math.sin(angle + arc / 2) * 120
    );
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    ctx.fillText(items[i], -ctx.measureText(items[i]).width / 2, 0);
    ctx.restore();
  }
}

function spin() {
  const spinAngle = Math.random() * 2000 + 2000;
  const duration = 4000;
  const start = performance.now();

  function animate(time) {
    const progress = Math.min((time - start) / duration, 1);

    startAngle += (spinAngle * (1 - easeOut(progress))) * Math.PI / 180;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      showResult();
    }
  }

  requestAnimationFrame(animate);
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function showResult() {
  const degrees = startAngle * 180 / Math.PI + 90;
  const arcDeg = arc * 180 / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcDeg) % items.length;

  document.getElementById("result").innerHTML =
    "🎉 결과: <span style='color:yellow'>" + items[index] + "</span>";
}

/* 🎯 이벤트 */
document.getElementById("spinBtn").addEventListener("click", spin);

/* 💡 제안 버튼 */
document.getElementById("suggestBtn").addEventListener("click", () => {
  const input = prompt("추가할 항목 입력:");
  if (!input) return;

  items.push(input);
  arc = Math.PI * 2 / items.length;
  drawWheel();
});
