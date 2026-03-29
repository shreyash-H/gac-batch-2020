async function loadStudents(){
    let res=await fetch('students.csv');
    let txt=await res.text();
    let rows=txt.split('\n').slice(1);
    return rows.map((r,i)=>{
        let [n,m]=r.split(',');
        return{name:n.trim(),msg:m.trim(),idx:i}
    });
}

async function initPeople(){
    let data=await loadStudents();
    let c=document.getElementById('peopleContainer');
    data.forEach((s,i)=>{
        let roll=String(i+1).padStart(3,'0');
        c.innerHTML+=`<div class="card" onclick="showPreview('${s.name}','${s.msg}','${roll}')">
            <div class="avatar">${roll}</div><h3>${s.name}</h3></div>`;
    });
}

let currentName='',currentRoll='';
function showPreview(n,m,r){
    currentName=n;
    currentRoll=r;
    let p=document.getElementById('popup');
    p.style.display='flex';
    document.getElementById('popupName').innerText=n;
    document.getElementById('popupRoll').innerText=r;
    setTimeout(()=>document.querySelector('.popup-content').classList.add('show'),10);
}

function closePopup(){
    let p=document.getElementById('popup');
    document.querySelector('.popup-content').classList.remove('show');
    setTimeout(()=>p.style.display='none',300);
}

function goToProfile(){
    location.href="profile.html?name="+encodeURIComponent(currentName);
}

async function initProfile(){
    let params=new URLSearchParams(location.search);
    let name=decodeURIComponent(params.get("name"));
    let data=await loadStudents();
    let i=data.findIndex(s=>s.name==name);
    show(i,data);

    let startX=0;
    document.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
    document.addEventListener("touchend",e=>{
        let diff=startX-e.changedTouches[0].clientX;
        if(diff>50&&i<data.length-1)i++;
        if(diff<-50&&i>0)i--;
        show(i,data);
    });
}

function show(i,data){
    let s=data[i];
    document.getElementById("name").innerText=s.name;
    document.getElementById("avatar").innerText=String(i+1).padStart(3,'0');
}
