import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set
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

/* 🎡 상태 */
let items = [];
let startAngle = 0;
let arc;

/* 캔버스 */
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const colors = [
  "#ff6b6b","#ffd93d","#6bcB77","#4d96ff",
  "#c77dff","#ff922b","#20c997","#f06595"
];

/* 🔐 SHA256 */
async function sha256(text){
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(text));

  return [...new Uint8Array(buf)]
    .map(b => b.toString(16).padStart(2,"0"))
    .join("");
}

/* 📥 Firebase 로드 */
async function load(){
  const snap = await get(ref(db,"Rollet/items"));

  if(snap.exists()){
    items = snap.val();
  }

  arc = Math.PI*2/items.length;
  drawWheel();
  renderList();
}

/* 💾 저장 */
function save(){
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

/* 🎯 spin */
function spin(){
  const spinAngle = Math.random()*2000+2000;
  const start = performance.now();

  function animate(t){
    const p = Math.min((t-start)/4000,1);
    startAngle += (spinAngle*(1-p*p*p))*Math.PI/180;
    drawWheel();

    if(p<1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* 🔐 관리자 인증 */
async function adminLogin(){
  const pw = prompt("관리자 비밀번호");

  const inputHash = await sha256(pw);

  const snap = await get(ref(db,"Rollet/admin/passwordHash"));

  if(!snap.exists()){
    alert("관리자 설정 없음");
    return false;
  }

  if(inputHash === snap.val()){
    alert("관리자 인증 성공 🔐");
    document.getElementById("adminPanel").classList.remove("hidden");
    return true;
  } else {
    alert("비밀번호 틀림");
    return false;
  }
}

/* ➕ 추가 */
async function addItem(){
  const v = prompt("추가:");
  if(!v) return;

  items.push(v);
  save();
  drawWheel();
  renderList();
}

/* 🗑 삭제 */
function deleteItem(i){
  items.splice(i,1);
  save();
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
document.getElementById("addBtn").addEventListener("click",addItem);
document.getElementById("adminBtn").addEventListener("click",adminLogin);

/* 🚀 시작 */
load();
