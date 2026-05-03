let items = JSON.parse(localStorage.getItem("roulette_items") || "[]");
let startAngle = 0;
let arc;

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const colors = [
  "#ff6b6b","#ffd93d","#6bcB77","#4d96ff",
  "#c77dff","#ff922b","#20c997","#f06595"
];

/* 📦 JSON + 로컬 합치기 */
fetch("Item.json?v=" + Date.now())
  .then(res => res.json())
  .then(data => {
    items = [...new Set([...data.items, ...items])];
    arc = Math.PI * 2 / items.length;
    drawWheel();
  });

/* 🎡 룰렛 */
function drawWheel() {
  ctx.clearRect(0,0,400,400);

  for(let i=0;i<items.length;i++){
    const angle = startAngle + i*arc;

    ctx.fillStyle = colors[i % colors.length];

    ctx.beginPath();
    ctx.moveTo(200,200);
    ctx.arc(200,200,180,angle,angle+arc);
    ctx.fill();

    ctx.save();
    ctx.fillStyle="white";
    ctx.translate(
      200 + Math.cos(angle+arc/2)*120,
      200 + Math.sin(angle+arc/2)*120
    );
    ctx.rotate(angle+arc/2+Math.PI/2);
    ctx.fillText(items[i], -ctx.measureText(items[i]).width/2,0);
    ctx.restore();
  }
}

/* 🎯 돌리기 */
function spin(){
  const spinAngle = Math.random()*2000+2000;
  const start = performance.now();

  function animate(t){
    const p = Math.min((t-start)/4000,1);
    startAngle += (spinAngle*(1-p*p*p))*Math.PI/180;
    drawWheel();

    if(p<1) requestAnimationFrame(animate);
    else showResult();
  }
  requestAnimationFrame(animate);
}

/* 🎉 결과 */
function showResult(){
  const deg = startAngle*180/Math.PI+90;
  const arcDeg = arc*180/Math.PI;
  const index = Math.floor((360-(deg%360))/arcDeg)%items.length;

  document.getElementById("result").innerHTML =
    "🎉 " + items[index];
}

/* 💡 추가 */
document.getElementById("suggestBtn").addEventListener("click",()=>{
  const v = prompt("추가:");
  if(!v) return;

  items.push(v);
  localStorage.setItem("roulette_items",JSON.stringify(items));
  arc = Math.PI*2/items.length;
  drawWheel();
});

/* 🧹 초기화 */
document.getElementById("resetBtn").addEventListener("click",()=>{
  if(!confirm("초기화?")) return;
  localStorage.removeItem("roulette_items");
  location.reload();
});

/* 🔐 관리자 */
let admin=false;

document.getElementById("adminBtn").addEventListener("click",()=>{
  const pw = prompt("비밀번호:");
  if(pw==="1234"){
    admin=true;
    document.getElementById("adminPanel").classList.remove("hidden");
  }
});

/* ➕ 추가 */
document.getElementById("addBtn").addEventListener("click",()=>{
  const v = prompt("항목:");
  if(!v) return;
  items.push(v);
  localStorage.setItem("roulette_items",JSON.stringify(items));
  arc = Math.PI*2/items.length;
  drawWheel();
});

/* ❌ 삭제 */
document.getElementById("deleteBtn").addEventListener("click",()=>{
  const v = document.getElementById("deleteInput").value;
  items = items.filter(i=>i!==v);
  localStorage.setItem("roulette_items",JSON.stringify(items));
  arc = Math.PI*2/items.length;
  drawWheel();
});

/* 이벤트 */
document.getElementById("spinBtn").addEventListener("click",spin);
