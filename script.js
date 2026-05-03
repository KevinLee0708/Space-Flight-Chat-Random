import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* 🔥 Firebase 설정 */
const firebaseConfig = {
    apiKey: "AIzaSyCNNbsbuyLDfZN8XB5uzexBNaNA_MuJ8QI",
    authDomain: "website-kevinlee0708.firebaseapp.com",
    projectId: "website-kevinlee0708",
    storageBucket: "website-kevinlee0708.firebasestorage.app",
    messagingSenderId: "313895693324",
    appId: "1:313895693324:web:81941ff11d726c7d7fd229",
    measurementId: "G-4NP7NRK0ED"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* 🎯 상태 */
let items = [];
let startAngle = 0;
let arc;

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const colors = [
  "#ff6b6b","#ffd93d","#6bcB77","#4d96ff",
  "#c77dff","#ff922b","#20c997","#f06595"
];

/* 📥 Firebase 로드 (Rollet/items) */
async function loadData(){
  const snap = await get(ref(db,"Rollet/items"));

  if(snap.exists()){
    items = snap.val();
  } else {
    const res = await fetch("Item.json");
    const data = await res.json();
    items = data.items;
    saveData();
  }

  arc = Math.PI*2/items.length;
  drawWheel();
  renderList();
}

/* 💾 저장 */
function saveData(){
  set(ref(db,"Rollet/items"), items);
}

/* 🎡 룰렛 */
function drawWheel(){
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
    ctx.rotate(angle+arc/2);
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

  document.getElementById("result").innerText =
    "🎉 " + items[index];
}

/* ➕ 추가 */
document.getElementById("addBtn").addEventListener("click",async ()=>{
  const v = prompt("추가:");
  if(!v) return;

  items.push(v);
  saveData();
  drawWheel();
  renderList();
});

/* 🔐 관리자 */
let admin=false;

document.getElementById("adminBtn").addEventListener("click",()=>{
  const pw = prompt("비밀번호:");
  if(pw==="1234"){
    admin=true;
    document.getElementById("adminPanel").classList.remove("hidden");
    renderList();
  }
});

/* 🗑 삭제 */
function deleteItem(i){
  items.splice(i,1);
  saveData();
  drawWheel();
  renderList();
}

/* 📋 리스트 */
function renderList(){
  const list = document.getElementById("list");
  if(!list) return;

  list.innerHTML="";

  items.forEach((item,i)=>{
    const div=document.createElement("div");
    div.innerHTML=`
      ${item}
      <button onclick="deleteItem(${i})">🗑</button>
    `;
    list.appendChild(div);
  });
}

/* 🎯 이벤트 */
document.getElementById("spinBtn").addEventListener("click",spin);

/* 🚀 시작 */
loadData();
