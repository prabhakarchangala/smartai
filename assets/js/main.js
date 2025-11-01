
/* main.js - init and page-specific logic for SmartAIGram static demo */

// Utility: format today's date
function formatDate(d=new Date()){ return d.toLocaleDateString(); }

// ---- Login modal & auth ----
async function openLoginModal(kind){ // kind: 'user' | 'admin'
  const modal = document.createElement('div'); modal.className='modal card'; modal.id='loginModal';
  modal.innerHTML = `<h3>${kind==='admin'?'Admin':'User'} Login</h3>
    <label>Email</label><input id='liEmail' class='input' placeholder='Email' />
    <label>Password</label><input id='liPw' class='input' type='password' placeholder='Password' />
    <div style='display:flex;gap:8px;margin-top:8px'><button class='btn' id='doLogin'>Login</button><button class='btn ghost' id='cancelLogin'>Cancel</button></div>
    <div class='muted' style='margin-top:8px'>Demo: admin@smartgram.com/admin123 or user1@gram.com/user123</div>`;
  document.getElementById('modalRoot')?.appendChild(modal) || document.body.appendChild(modal);
  document.getElementById('cancelLogin').addEventListener('click',()=>modal.remove());
  document.getElementById('doLogin').addEventListener('click',async ()=>{
    const e=document.getElementById('liEmail').value.trim(); const p=document.getElementById('liPw').value.trim();
    if(!e||!p){ alert('Please enter email & password'); return; }
    const users = await DB.getUsers(); const u = users.find(x=>x.email===e && x.pw===p);
    if(!u){ alert('Invalid demo credentials'); return; }
    // store simple auth
    const token = 'demo-token-'+Math.random().toString(36).slice(2); localStorage.setItem('sag_user', JSON.stringify({email:u.email,role:u.role,token}));
    modal.remove();
    if(u.role==='master') window.location.href='admin.html'; else window.location.href='home.html';
  });
}

// ---- Home page ----
async function loadHome(){
  document.getElementById('todayDate').textContent = formatDate();
  const shops = await DB.getShops(); const products = await DB.getProducts(); const offers = await DB.getOffers();
  const carousel = document.getElementById('carousel'); carousel.innerHTML='';
  shops.forEach(s=>{ const el=document.createElement('div'); el.className='card'; el.style.minWidth='220px'; el.style.flex='0 0 auto'; el.innerHTML=`<div style="height:120px;background-image:url(${s.banner});background-size:cover;border-radius:8px"></div><div style="margin-top:8px;font-weight:700">${s.name}</div><div class='muted'>${s.type}</div>`; el.addEventListener('click',()=>window.location.href='shop.html?id='+s.id); carousel.appendChild(el); });
  // categories
  const catSet = new Set(['All']); products.forEach(p=>catSet.add(p.category));
  const catSelect = document.getElementById('catSelect'); catSelect.innerHTML=''; Array.from(catSet).forEach(c=>{ const o=document.createElement('option'); o.value=c.toLowerCase(); o.textContent=c; catSelect.appendChild(o); });
  const filterCat = document.getElementById('filterCat'); filterCat.innerHTML=''; Array.from(catSet).forEach(c=>{ const o=document.createElement('option'); o.value=c.toLowerCase(); o.textContent=c; filterCat.appendChild(o); });
  // open shops
  const now = new Date();
  function isOpen(s){ const [oh,om]=s.open.split(':').map(Number); const [ch,cm]=s.close.split(':').map(Number); const openT=new Date(); openT.setHours(oh,om,0,0); const closeT=new Date(); closeT.setHours(ch,cm,0,0); return now>=openT && now<=closeT; }
  const openEl = document.getElementById('openShops'); openEl.innerHTML=''; shops.filter(isOpen).forEach(s=>{ const d=document.createElement('div'); d.className='card'; d.style.minWidth='160px'; d.innerHTML=`<div style="font-weight:700">${s.name}</div><div class='muted'>${s.type}</div><div style="margin-top:6px;font-weight:700;color:green">Open</div>`; openEl.appendChild(d); });
  // offers row
  const offerRow = document.getElementById('offersRow'); offerRow.innerHTML=''; offers.forEach(o=>{ const s=shops.find(x=>x.id===o.shopId); const c=document.createElement('div'); c.className='card'; c.style.minWidth='200px'; c.innerHTML=`<div style="font-weight:800">${o.title}</div><div class='muted'>${s.name}</div><div style="margin-top:6px">${o.desc}</div><div class='muted'>Expiry: ${o.expiry}</div>`; offerRow.appendChild(c); });
  // trending grid
  const grid = document.getElementById('trendingGrid'); grid.innerHTML=''; products.slice(0,12).forEach(p=>{ const d=document.createElement('div'); d.className='product-card'; d.innerHTML=`<img src='${p.img}' alt='${p.name}'/><div style="font-weight:700;margin-top:8px">${p.name}</div><div class="product-meta"><div>₹${p.price}</div><div class='muted'>${p.rating} ★</div></div><div style="margin-top:8px;display:flex;gap:8px"><button class='btn ghost' onclick="window.location.href='shop.html?id=${p.shopId}'">View Shop Details</button><button class='btn' onclick="alert('View Products')">View Products</button></div>`; grid.appendChild(d); });
  // search and filter hooks
  document.getElementById('searchBtn').onclick = async ()=>{ const q=document.getElementById('searchInput').value.toLowerCase(); const res = (await DB.getProducts()).filter(p=>p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)); grid.innerHTML=''; res.slice(0,12).forEach(p=>{ const d=document.createElement('div'); d.className='product-card'; d.innerHTML=`<img src='${p.img}'/><div style="font-weight:700;margin-top:8px">${p.name}</div><div class="product-meta"><div>₹${p.price}</div><div class='muted'>${p.rating} ★</div></div>`; grid.appendChild(d); }); };
  document.getElementById('applyFilters').onclick = async ()=>{ let cat=document.getElementById('filterCat').value; let price=document.getElementById('filterPrice').value; let prods=await DB.getProducts(); if(cat!=='all') prods=prods.filter(p=>p.category.toLowerCase()===cat); if(price==='low') prods=prods.filter(p=>p.price<50); if(price==='mid') prods=prods.filter(p=>p.price>=50 && p.price<=200); if(price==='high') prods=prods.filter(p=>p.price>200); grid.innerHTML=''; prods.slice(0,12).forEach(p=>{ const d=document.createElement('div'); d.className='product-card'; d.innerHTML=`<img src='${p.img}'/><div style="font-weight:700;margin-top:8px">${p.name}</div><div class="product-meta"><div>₹${p.price}</div><div class='muted'>${p.rating} ★</div></div>`; grid.appendChild(d); }); };
  document.getElementById('btnEnquiry').onclick = ()=> window.location.href='enquiry.html';
}

// ---- Shop page ----
async function openShop(id){
  const s = await DB.getShop(id); if(!s) return alert('Shop not found');
  document.getElementById('shopBanner').style.backgroundImage = `url(${s.banner})`;
  document.getElementById('shopName').textContent = s.name;
  document.getElementById('shopMeta').textContent = s.type + ' • ' + s.loc;
  document.getElementById('shopRating').textContent = s.rating + ' ★';
  const now=new Date(); const isOpen = (()=>{ const [oh,om]=s.open.split(':').map(Number); const [ch,cm]=s.close.split(':').map(Number); const openT=new Date(); openT.setHours(oh,om,0,0); const closeT=new Date(); closeT.setHours(ch,cm,0,0); return now>=openT && now<=closeT; })();
  document.getElementById('openIndicator').textContent = isOpen? 'OPEN':'CLOSED';
  const tabs = document.getElementById('shopTabs'); tabs.innerHTML='';
  // products for this shop
  const prods = (await DB.getProducts()).filter(p=>p.shopId===s.id);
  const prodGrid = document.createElement('div'); prodGrid.className='grid'; prodGrid.innerHTML = prods.map(p=>`<div class="product-card"><img src="${p.img}" alt="${p.name}"/><div style="font-weight:700;margin-top:8px">${p.name}</div><div class="product-meta"><div>₹${p.price}</div><div class='muted'>${p.rating} ★</div></div></div>`).join('');
  // offers
  const offers = (await DB.getOffers()).filter(o=>o.shopId===s.id);
  const offDiv = document.createElement('div'); offDiv.innerHTML = offers.length? offers.map(o=>`<div class='card'><strong>${o.title}</strong><div class='muted'>Expires: ${o.expiry}</div><div>${o.desc}</div></div>`).join('') : '<div class="muted">No offers</div>';
  const contactDiv = document.createElement('div'); contactDiv.innerHTML = `<div class='muted'>WhatsApp: ${s.phone}</div><div class='muted'>Call: ${s.phone}</div><div style='margin-top:8px'><button class='btn' onclick="alert('Open map (placeholder)')">Open Map</button></div>`;
  tabs.appendChild(prodGrid);
  document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{ tabs.innerHTML=''; if(b.getAttribute('data-tab')==='products') tabs.appendChild(prodGrid); if(b.getAttribute('data-tab')==='offers') tabs.appendChild(offDiv); if(b.getAttribute('data-tab')==='contact') tabs.appendChild(contactDiv); }));
  document.getElementById('enquiryBtn').addEventListener('click',()=>{ localStorage.setItem('lastEnqShop', s.id); window.location.href='enquiry.html'; });
}

// ---- Products page ----
async function loadProducts(){
  const products = await DB.getProducts(); const grid = document.getElementById('productsGrid'); grid.innerHTML='';
  products.forEach(p=>{ const d=document.createElement('div'); d.className='product-card'; d.innerHTML=`<img src='${p.img}' alt='${p.name}'/><div style="font-weight:700;margin-top:8px">${p.name}</div><div class="product-meta"><div>₹${p.price}</div><div class='muted'>${p.rating} ★</div></div><div style="margin-top:8px;display:flex;gap:8px"><button class='btn ghost' onclick="window.location.href='shop.html?id=${p.shopId}'">Go to Shop</button><button class='btn' onclick="alert('Added (demo)')">Add</button></div>`; grid.appendChild(d); });
  document.getElementById('sortBy').addEventListener('change', async function(){ const v=this.value; let arr=await DB.getProducts(); if(v==='price-asc') arr.sort((a,b)=>a.price-b.price); if(v==='price-desc') arr.sort((a,b)=>b.price-a.price); const g=document.getElementById('productsGrid'); g.innerHTML=''; arr.forEach(p=>{ const d=document.createElement('div'); d.className='product-card'; d.innerHTML=`<img src='${p.img}' alt='${p.name}'/><div style="font-weight:700;margin-top:8px">${p.name}</div><div class="product-meta"><div>₹${p.price}</div><div class='muted'>${p.rating} ★</div></div>`; g.appendChild(d); }); });
}

// ---- Offers ----
async function loadOffers(){ const offers = await DB.getOffers(); const shops = await DB.getShops(); const out=document.getElementById('offersList'); out.innerHTML=''; offers.forEach(o=>{ const s=shops.find(x=>x.id===o.shopId); const d=document.createElement('div'); d.className='card'; d.innerHTML=`<div style="display:flex;justify-content:space-between"><div><strong>${o.title}</strong><div class='muted'>${s.name}</div></div><div><div class='muted'>Expiry: ${o.expiry}</div><button class='btn' onclick="window.location.href='shop.html?id=${s.id}'">Visit Shop</button></div></div>`; out.appendChild(d); }); }

// ---- Shops list ----
async function loadShops(){ const shops=await DB.getShops(); const out=document.getElementById('shopsList'); out.innerHTML=''; shops.forEach(s=>{ const d=document.createElement('div'); d.className='card'; d.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${s.name}</strong><div class='muted'>${s.type} • ${s.loc}</div></div><div><button class='btn' onclick="window.location.href='shop.html?id=${s.id}'">Details</button></div></div>`; out.appendChild(d); }); }

// ---- Contact & Enquiry handlers ----
document.addEventListener('click',(e)=>{
  if(e.target && e.target.id==='contactSubmit'){
    const name=document.getElementById('contactName').value.trim(); const email=document.getElementById('contactEmail').value.trim(); const msg=document.getElementById('contactMsg').value.trim();
    if(!name||!email||!msg){ alert('Please fill all fields'); return; }
    document.getElementById('contactSuccess').style.display='block';
  }
  if(e.target && e.target.id==='callSupport'){ alert('Call Support: +91 90000 00000 (mock)'); }
  if(e.target && e.target.id==='enqSubmit'){ document.getElementById('enqSuccess').style.display='block'; }
});

// ---- Admin ----
async function loadAdmin(){
  const shops = await DB.getShops(); const products = await DB.getProducts(); const offers = await DB.getOffers(); const users = await DB.getUsers();
  document.getElementById('statShops').textContent = shops.length; document.getElementById('statProducts').textContent = products.length; document.getElementById('statOffers').textContent = offers.length; document.getElementById('statUsers').textContent = users.length;
  const ctrl = document.getElementById('adminControls'); ctrl.innerHTML='';
  const list = document.createElement('div'); list.innerHTML = '<h4>Shop Management</h4>';
  shops.forEach(s=>{ const el=document.createElement('div'); el.className='card'; el.style.display='flex'; el.style.justifyContent='space-between'; el.style.alignItems='center'; el.innerHTML=`<div><strong>${s.name}</strong><div class='muted'>${s.type} • ${s.loc}</div></div><div style='display:flex;gap:8px'><button class='btn' data-edit='${s.id}'>Edit</button><button class='btn ghost' data-del='${s.id}'>Delete</button></div>`; list.appendChild(el); });
  ctrl.appendChild(list);
  document.getElementById('createShopBtn').onclick = ()=>{ const m=document.createElement('div'); m.className='modal card'; m.innerHTML=`<h3>Create Shop</h3><label>Name</label><input id='nsName' class='input'/><label>Type</label><input id='nsType' class='input'/><label>Location</label><input id='nsLoc' class='input'/><label>Phone</label><input id='nsPhone' class='input'/><label>Open</label><input id='nsOpen' class='input' value='08:00'/><label>Close</label><input id='nsClose' class='input' value='20:00'/><label>Banner URL</label><input id='nsBanner' class='input' placeholder='https://...'/><div style='display:flex;gap:8px;margin-top:8px'><button class='btn' id='createShopNow'>Create</button><button class='btn ghost' id='cancelCreateShop'>Cancel</button></div>`; document.getElementById('modalRoot').appendChild(m); document.getElementById('cancelCreateShop').onclick = ()=>m.remove(); document.getElementById('createShopNow').onclick = async ()=>{ const s = {name:document.getElementById('nsName').value,type:document.getElementById('nsType').value,loc:document.getElementById('nsLoc').value,phone:document.getElementById('nsPhone').value,open:document.getElementById('nsOpen').value,close:document.getElementById('nsClose').value,rating:4.0,banner:document.getElementById('nsBanner').value||'https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=1600&auto=format&fit=crop'}; await DB.createShop(s); alert('Shop created (mock)'); m.remove(); loadAdmin(); };
  };
  // delete/edit handlers (delegate)
  ctrl.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click', async ()=>{ if(confirm('Delete shop?')){ await DB.deleteShop(b.getAttribute('data-del')); loadAdmin(); } }));
  ctrl.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click', async ()=>{ const id=b.getAttribute('data-edit'); const s=(await DB.getShops()).find(x=>x.id===id); const m=document.createElement('div'); m.className='modal card'; m.innerHTML=`<h3>Edit Shop</h3><label>Name</label><input id='esName' class='input' value='${s.name}'/><label>Type</label><input id='esType' class='input' value='${s.type}'/><label>Location</label><input id='esLoc' class='input' value='${s.loc}'/><label>Phone</label><input id='esPhone' class='input' value='${s.phone}'/><label>Open</label><input id='esOpen' class='input' value='${s.open}'/><label>Close</label><input id='esClose' class='input' value='${s.close}'/><div style='display:flex;gap:8px;margin-top:8px'><button class='btn' id='saveShop'>Save</button><button class='btn ghost' id='cancelEdit'>Cancel</button></div>`; document.getElementById('modalRoot').appendChild(m); document.getElementById('cancelEdit').onclick = ()=>m.remove(); document.getElementById('saveShop').onclick = async ()=>{ const payload={name:document.getElementById('esName').value,type:document.getElementById('esType').value,loc:document.getElementById('esLoc').value,phone:document.getElementById('esPhone').value,open:document.getElementById('esOpen').value,close:document.getElementById('esClose').value}; await DB.updateShop(id,payload); alert('Shop updated (mock)'); m.remove(); loadAdmin(); }; }));
  document.getElementById('logoutAdmin').onclick = ()=>{ localStorage.removeItem('sag_user'); alert('Logged out'); window.location.href='login.html'; };
}

// ---- Enquiry populate ----
async function populateEnquiry(){ const sel=document.getElementById('enqShop'); if(!sel) return; const shops = await DB.getShops(); sel.innerHTML=''; shops.forEach(s=>{ const o=document.createElement('option'); o.value=s.id; o.textContent=s.name; sel.appendChild(o); }); const last=localStorage.getItem('lastEnqShop'); if(last) sel.value=last; document.getElementById('enqSubmit')?.addEventListener('click',()=>{ document.getElementById('enqSuccess').style.display='block'; }); }

// ---- Init small guard: if no auth and admin page accessed, show alert ----
if(location.pathname.endsWith('/admin.html')){ const u=localStorage.getItem('sag_user'); if(!u){ alert('Please login as admin (demo)'); window.location.href='login.html'; } }
