const CATS=["🍽️ Khana","🚌 Travel","🛍️ Shopping","📚 Padhai","🏠 Ghar","🎬 Maza","💊 Health","➕ Other"];
const IN="💰 Pocket money";
let S={tx:[],bud:{},goals:[],rec:[],debts:[]};
try{Object.assign(S,JSON.parse(localStorage.getItem("pd2")||"{}"));
if(!S.tx.length){const o=JSON.parse(localStorage.getItem("exp")||"[]");S.tx=o.map(x=>({id:x.id,t:"e",a:x.a,c:x.c,n:x.n,d:x.d}))}}catch(e){}
const save=()=>{try{localStorage.setItem("pd2",JSON.stringify(S))}catch(e){}};
let uid=Date.now();const nid=()=>++uid;
const $=s=>document.querySelector(s);
const esc=s=>String(s||"").replace(/[<>&"]/g,"");
const fmt=n=>"₹"+Math.round(n).toLocaleString("en-IN");
const ym=d=>d.slice(0,7);
const today=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const pad=n=>String(n).padStart(2,"0");
const mAdd=(m,k)=>{let[y,n]=m.split("-").map(Number);let z=n-1+k;y+=Math.floor(z/12);z=((z%12)+12)%12;return y+"-"+pad(z+1)};
const mName=(m,l)=>new Date(m+"-01T00:00").toLocaleDateString("en-IN",l?{month:"long",year:"numeric"}:{month:"short"});
let view="home",month=ym(today()),tab="all",q="",fc="",msg="";
const sum=a=>a.reduce((s,x)=>s+x.a,0);
const exp=m=>sum(S.tx.filter(x=>x.t==="e"&&ym(x.d)===m));
const inc=m=>sum(S.tx.filter(x=>x.t==="i"&&ym(x.d)===m));
const catExp=(c,m)=>sum(S.tx.filter(x=>x.t==="e"&&x.c===c&&ym(x.d)===m));
const totBud=()=>Object.values(S.bud).reduce((s,v)=>s+(+v||0),0);
function runRec(){const cm=ym(today()),td=+today().slice(8);let ch=0;
S.rec.forEach(r=>{let m=r.last?mAdd(r.last,1):cm;
while(m<=cm){const dd=Math.min(r.day,28);if(m<cm||td>=dd){S.tx.push({id:nid(),t:r.t,a:r.a,c:r.c,n:r.n+" (recurring)",d:m+"-"+pad(dd)});r.last=m;ch=1}else break;m=mAdd(m,1)}});
if(ch)save()}
runRec();
function theme(){const r=document.documentElement,d=r.dataset.theme==="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=d?"light":"dark"}
const go=v=>{view=v;msg="";render();scrollTo(0,0)};
const mv=k=>{month=mAdd(month,k);render()};
const mbar=()=>`<div class="mb"><button onclick="mv(-1)">‹</button><b>${mName(month,1)}</b><button onclick="mv(1)">›</button></div>`;
const bar=(p,c)=>`<div class="pb"><i style="width:${Math.min(100,p)}%;${p>=100?"background:var(--bad)":""}"></i></div>`;
function addTx(t,a,c,n){a=parseFloat(a);if(!(a>0))return false;S.tx.push({id:nid(),t,a,c,n:(n||"").trim(),d:today()});save();toast("✅ Add ho gaya");return true}
function qi(a){addTx("i",a,IN,"");render()}
function ci(){if(addTx("i",$("#ci").value,IN,""))render()}
function ae(){if(addTx("e",$("#amt").value,$("#cat").value,$("#note").value))render();else $("#amt").focus()}
function del(id){S.tx=S.tx.filter(x=>x.id!==id);save();render()}
function setBud(i,v){S.bud[CATS[i]]=+v||0;save();render()}
function addGoal(){const n=$("#gn").value.trim(),t=parseFloat($("#gt").value);if(!n||!(t>0))return;S.goals.push({id:nid(),n,t,s:0});save();render()}
function gAmt(id,sg){const v=parseFloat($("#ga"+id).value);if(!(v>0))return;const g=S.goals.find(x=>x.id===id);g.s=Math.max(0,g.s+sg*v);save();render()}
function delGoal(id){S.goals=S.goals.filter(x=>x.id!==id);save();render()}
function addRec(){const a=parseFloat($("#ra").value);if(!(a>0))return;S.rec.push({id:nid(),t:$("#rt").value,a,c:$("#rc").value,n:$("#rn").value.trim()||"Recurring",day:Math.min(28,Math.max(1,+$("#rd").value||1))});save();runRec();render()}
function delRec(id){S.rec=S.rec.filter(x=>x.id!==id);save();render()}
function addDebt(){const a=parseFloat($("#da").value),w=$("#dw").value.trim();if(!(a>0)||!w)return;S.debts.push({id:nid(),w,a,dir:$("#dd").value,d:today(),paid:false});save();render()}
function payDebt(id){const x=S.debts.find(y=>y.id===id);x.paid=!x.paid;save();render()}
function delDebt(id){S.debts=S.debts.filter(x=>x.id!==id);save();render()}
function setTab(t){tab=t;render()}
function filt(){q=$("#q").value.toLowerCase();fc=$("#fc").value;$("#lst").innerHTML=lst()}
function csv(){const rows=[["Date","Type","Category","Note","Amount"],...[...S.tx].sort((a,b)=>a.d<b.d?1:-1).map(x=>[x.d,x.t==="e"?"Expense":"Income",x.c,x.n,x.a])];
const t=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n");
$("#csvbox").innerHTML=`<textarea id="cta" readonly>${t.replace(/</g,"")}</textarea>`;const ta=$("#cta");ta.select();
try{navigator.clipboard.writeText(t).then(()=>{msg="CSV copy ho gaya ✅ Notes/Excel me paste karo"; $("#cm").textContent=msg})}catch(e){}}
function prt(){try{window.print()}catch(e){}}
function lst(){
let a=S.tx.filter(x=>ym(x.d)===month);
if(tab==="e")a=a.filter(x=>x.t==="e");if(tab==="i")a=a.filter(x=>x.t==="i");
if(fc)a=a.filter(x=>x.c===fc);
if(q)a=a.filter(x=>(x.n+x.c+x.d).toLowerCase().includes(q));
a.sort((x,y)=>x.d<y.d?1:-1);
return a.length?a.map(x=>`<div class="it"><div class="em">${x.c.split(" ")[0]}</div><div><b>${esc(x.c.split(" ").slice(1).join(" "))}</b><small>${x.d}${x.n?" · "+esc(x.n):""}</small></div><span class="${x.t==="e"?"neg":"pos"}">${x.t==="e"?"-":"+"}${fmt(x.a)}</span><button class="x" onclick="del(${x.id})">✕</button></div>`).join(""):'<div class="empty">Kuch nahi mila</div>'}
const opts=(all)=>(all?'<option value="">Sab category</option>':"")+CATS.map(c=>`<option>${c}</option>`).join("");
function home(){
const e=exp(month),i=inc(month),tb=totBud();
const allI=sum(S.tx.filter(x=>x.t==="i")),allE=sum(S.tx.filter(x=>x.t==="e"));
const dt=sum(S.debts.filter(x=>!x.paid&&x.dir==="took"))-sum(S.debts.filter(x=>!x.paid&&x.dir==="gave"));
const bal=allI-allE+dt;
let al="";if(tb>0){const p=e/tb*100;if(p>=100)al=`<div class="alert">🚨 Is mahine ka budget khatam! ${fmt(e)} / ${fmt(tb)}</div>`;else if(p>=80)al=`<div class="alert">⚠️ Budget ka ${Math.round(p)}% use ho gaya. ${fmt(tb-e)} bacha hai.</div>`}
const ms=[-5,-4,-3,-2,-1,0].map(k=>mAdd(month,k)),ac=ms.map(exp),mx=Math.max(1,tb,...ac);
const used=ac.filter(v=>v>0),avg=used.length?sum(used.map(a=>({a})))/used.length:0,pe=exp(mAdd(month,-1));
const df=pe>0?Math.round((e-pe)/pe*100):null;
return `${mbar()}${al}
<div class="hero"><small>Total Balance</small><h3>${fmt(bal)}</h3><div class="hs"><span>⬇️ Income<b>${fmt(i)}</b></span><span>⬆️ Kharcha<b>${fmt(e)}</b></span></div></div>
<div class="card"><b>Aaj pocket money mila?</b><div class="chips" style="margin-top:8px">${[50,100,200,500].map(v=>`<button onclick="qi(${v})">+₹${v}</button>`).join("")}</div><div class="row"><input id="ci" type="number" inputmode="decimal" placeholder="Doosra amount"><button class="o" onclick="ci()">Add</button></div></div>
<div class="card"><b>Kharcha add karo</b><div class="row" style="margin-top:8px"><input id="amt" type="number" inputmode="decimal" placeholder="Amount ₹"><select id="cat">${opts()}</select></div><div class="row"><input id="note" placeholder="Note (optional)"></div><button class="p" style="width:100%" onclick="ae()">+ Add kharcha</button></div>
<div class="card"><b>Budget vs Actual</b><div class="lg" style="margin-top:8px"><span><i style="background:var(--pink)"></i>Budget</span><span><i style="background:var(--sage)"></i>Actual</span></div>
<div class="ch">${ms.map((m,j)=>`<div class="g"><div class="b"><i style="height:${tb/mx*100}%;background:var(--pink)"></i><i style="height:${ac[j]/mx*100}%;background:var(--sage)"></i></div>${mName(m)}</div>`).join("")}</div>
<div class="ft"><span><b>${fmt(avg)}</b>Avg monthly kharcha</span><span><b>${df===null?"–":(df>0?"↑ ":"↓ ")+Math.abs(df)+"%"}</b>Is mahine vs pichla</span></div>${tb?"":'<div class="empty">Budget tab me limit set karo, tab pink bars dikhenge</div>'}</div>`}
function act(){
const T=[["all","All"],["e","Kharche"],["i","Income"],["r","Recurring"],["u","Udhaar"]];
let b="";
if(tab==="r")b=`<div class="card"><b>Recurring add karo</b><div class="row" style="margin-top:8px"><input id="ra" type="number" placeholder="Amount ₹"><input id="rd" type="number" placeholder="Din (1-28)"></div><div class="row"><select id="rt"><option value="e">Kharcha</option><option value="i">Income</option></select><select id="rc">${opts()}</select></div><div class="row"><input id="rn" placeholder="Naam (rent, Netflix...)"></div><button class="p" style="width:100%" onclick="addRec()">Add</button></div><div class="card">${S.rec.length?S.rec.map(r=>`<div class="it"><div class="em">${r.c.split(" ")[0]}</div><div><b>${esc(r.n)}</b><small>Har mahine ${r.day} tarikh</small></div><span class="${r.t==="e"?"neg":"pos"}">${fmt(r.a)}</span><button class="x" onclick="delRec(${r.id})">✕</button></div>`).join(""):'<div class="empty">Koi recurring nahi</div>'}</div>`;
else if(tab==="u"){const g=sum(S.debts.filter(x=>!x.paid&&x.dir==="gave")),t=sum(S.debts.filter(x=>!x.paid&&x.dir==="took"));
b=`<div class="card st" style="grid-template-columns:1fr 1fr"><div><small>Lena hai</small><b class="pos">${fmt(g)}</b></div><div><small>Dena hai</small><b class="neg">${fmt(t)}</b></div></div><div class="card"><div class="row"><input id="dw" placeholder="Kiska naam"><input id="da" type="number" placeholder="₹"></div><div class="row"><select id="dd"><option value="gave">Maine diya (lena hai)</option><option value="took">Maine liya (dena hai)</option></select><button class="p" onclick="addDebt()">Add</button></div></div><div class="card">${S.debts.length?S.debts.map(x=>`<div class="it" style="${x.paid?"opacity:.5":""}"><div class="em">${x.dir==="gave"?"📤":"📥"}</div><div><b>${esc(x.w)}</b><small>${x.d} · ${x.dir==="gave"?"lena hai":"dena hai"}</small></div><span>${fmt(x.a)}</span><button class="x" onclick="payDebt(${x.id})">${x.paid?"↩":"✔"}</button><button class="x" onclick="delDebt(${x.id})">✕</button></div>`).join(""):'<div class="empty">Koi udhaar nahi</div>'}</div>`}
else b=`${mbar()}<div class="row"><input id="q" placeholder="🔍 Search" value="${esc(q)}" oninput="filt()"><select id="fc" onchange="filt()" style="width:46%">${opts(1).replace(`>${fc}<`,` selected>${fc}<`)}</select></div><div class="card" id="lst">${lst()}</div>`;
return `<div class="tabs">${T.map(t=>`<button class="${tab===t[0]?"on":""}" onclick="setTab('${t[0]}')">${t[1]}</button>`).join("")}</div>${b}`}
function budget(){const tb=totBud(),e=exp(month);
return `${mbar()}<div class="card"><b>Total: ${fmt(e)} / ${fmt(tb)}</b>${tb?bar(e/tb*100):""}</div>${CATS.map((c,i)=>{const b=S.bud[c]||0,a=catExp(c,month),p=b?a/b*100:0;
return `<div class="card"><div class="row" style="margin:0"><div class="em">${c.split(" ")[0]}</div><b style="flex:1">${c.split(" ").slice(1).join(" ")}</b><input type="number" inputmode="decimal" style="width:100px" placeholder="Limit ₹" value="${b||""}" onchange="setBud(${i},this.value)"></div>${b?bar(p)+`<small style="color:${p>=100?"var(--bad)":"var(--mute)"}">${fmt(a)} / ${fmt(b)}${p>=100?" 🚨 limit cross":p>=80?" ⚠️ 80% se zyada":""}</small>`:`<small style="color:var(--mute)">Kharcha: ${fmt(a)}</small>`}</div>`}).join("")}`}
function goals(){return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h2>Savings goals</h2></div>
<div class="card"><div class="row"><input id="gn" placeholder="Goal (Phone, Trip...)"><input id="gt" type="number" placeholder="Target ₹" style="width:42%"></div><button class="p" style="width:100%" onclick="addGoal()">+ New goal</button></div>
${S.goals.length?S.goals.map(g=>{const p=Math.round(g.s/g.t*100);return `<div class="card"><div class="row" style="margin:0"><div class="em">🎯</div><div style="flex:1"><b>${esc(g.n)}</b><small style="display:block;color:var(--mute)">${fmt(g.s)} of ${fmt(g.t)}</small></div><button class="x" onclick="delGoal(${g.id})">✕</button></div>${bar(p)}<div class="row" style="margin:0"><b style="flex:1">${p}%</b><input id="ga${g.id}" type="number" placeholder="₹" style="width:80px"><button onclick="gAmt(${g.id},-1)">−</button><button class="o" onclick="gAmt(${g.id},1)">+ Add</button></div></div>`}).join(""):'<div class="empty">Pehla goal banao 🎯</div>'}`}
function reports(){const pm=mAdd(month,-1),e=exp(month),pe=exp(pm);
return `${mbar()}<div class="card"><b>${mName(month)} vs ${mName(pm)}</b>${CATS.map(c=>{const a=catExp(c,month),b=catExp(c,pm);if(!a&&!b)return"";const d=a-b;return `<div class="it"><div class="em">${c.split(" ")[0]}</div><div><b>${fmt(a)}</b><small>Pichle mahine ${fmt(b)}</small></div><span class="${d>0?"neg":"pos"}">${d>0?"↑":"↓"} ${fmt(Math.abs(d))}</span></div>`}).join("")||'<div class="empty">Abhi data nahi</div>'}<div class="ft"><span><b>${fmt(e)}</b>Is mahine</span><span><b>${fmt(pe)}</b>Pichle mahine</span></div></div>
<div class="card noprint"><b>Export</b><div class="row" style="margin-top:8px"><button class="p" style="flex:1" onclick="csv()">Copy CSV</button><button class="o" style="flex:1" onclick="prt()">Print / PDF</button></div><small id="cm" style="color:var(--mute)"></small><div id="csvbox"></div></div>`}
function render(){
const N=[["home","🏠","Home"],["act","📋","Activity"],["bud","🎯","Budget"],["goal","🏆","Goals"],["rep","📊","Reports"]];
const V={home,act,bud:budget,goal:goals,rep:reports};
$("#app").innerHTML=`<div class="top"><div class="logo">💸</div><h1>Paisa Diary<small>BUDGET & EXPENSE TRACKER</small></h1><button class="ic" onclick="theme()">🌓</button></div>${V[view]()}<nav>${N.map(n=>`<button class="${view===n[0]?"on":""}" onclick="go('${n[0]}')"><span>${n[1]}</span>${n[2]}</button>`).join("")}</nav>`}
render();
if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}

function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1600)}
