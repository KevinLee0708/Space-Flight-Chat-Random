let items = [];
let startAngle = 0;
let arc;

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

fetch("Item.json")
  .then(res => res.json())
  .then(data => {
    items = data.items;
    arc = Math.PI * 2 / items.length;
    drawWheel();
  });

function drawWheel() {
  const outsideRadius = 180;
  const textRadius = 130;

  ctx.clearRect(0, 0, 400, 400);

  for (let i = 0; i < items.length; i++) {
    const angle = startAngle + i * arc;

    ctx.fillStyle = i % 2 === 0 ? "#ff7675" : "#74b9ff";

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, outsideRadius, angle, angle + arc);
    ctx.fill();

    ctx.save();
    ctx.fillStyle = "white";
    ctx.translate(
      200 + Math.cos(angle + arc / 2) * textRadius,
      200 + Math.sin(angle + arc / 2) * textRadius
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
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);

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
  const arcd = arc * 180 / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd) % items.length;

  document.getElementById("result").innerText =
    "🎉 결과: " + items[index];
}

document.getElementById("spinBtn").addEventListener("click", spin);
