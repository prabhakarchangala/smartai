
const DB = (function(){
  const shops = [
    {id:'shop1',name:'Grama Grocers',type:'Groceries',loc:'Village Center',phone:'+91 90000 00001',open:'07:00',close:'21:00',rating:4.6,banner:'https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=1600&auto=format&fit=crop'},
    {id:'shop2',name:'Quick Snacks',type:'Snacks',loc:'Market Road',phone:'+91 90000 00002',open:'09:00',close:'22:00',rating:4.2,banner:'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1600&auto=format&fit=crop'},
    {id:'shop3',name:'Village Clinic',type:'Clinic',loc:'Near Lake',phone:'+91 90000 00003',open:'10:00',close:'18:00',rating:4.7,banner:'https://images.unsplash.com/photo-1580281657521-5f2b1b2b3a69?q=80&w=1600&auto=format&fit=crop'},
    {id:'shop4',name:'Fresh Fruits',type:'Groceries',loc:'Panchayat',phone:'+91 90000 00004',open:'06:00',close:'20:00',rating:4.4,banner:'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=1600&auto=format&fit=crop'},
    {id:'shop5',name:"Mama's Dairy",type:'Dairy',loc:'East Street',phone:'+91 90000 00005',open:'05:30',close:'14:00',rating:4.1,banner:'https://images.unsplash.com/photo-1505577058444-a3dabf9f3f09?q=80&w=1600&auto=format&fit=crop'}
  ];
  const products = [];
  const cats = ['Groceries','Snacks','Dairy','Medicines','Fruits'];
  for(let i=1;i<=24;i++){
    products.push({
      id:'p'+i,
      name: (i<=8? 'Staple':'Delight') + ' Product ' + i,
      price: Math.round((10 + Math.random()*400)),
      category: cats[i%cats.length],
      shopId: shops[i%shops.length].id,
      img: (i%5===0? 'https://images.unsplash.com/photo-1543352634-3a3a0f464f9b?q=80&w=800&auto=format&fit=crop' : (i%4===0? 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop')),
      rating: (3 + Math.round(Math.random()*20)/10).toFixed(1),
      available: Math.random()>0.08
    });
  }
  function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x.toISOString().slice(0,10);}
  const now = new Date();
  const offers = [
    {id:'o1',shopId:'shop1',title:'Buy 1 Get 1',desc:'On select pulses',expiry:addDays(now,7)},
    {id:'o2',shopId:'shop2',title:'Snack Combo',desc:'20% off on combos',expiry:addDays(now,3)},
    {id:'o3',shopId:'shop4',title:'Fruit Box Offer',desc:'Special family box price',expiry:addDays(now,10)}
  ];
  const users = [{id:'admin',email:'admin@smartgram.com',role:'master',pw:'admin123'}];
  for(let i=1;i<=5;i++) users.push({id:'shopadmin'+i,email:'shop'+i+'@gram.com',role:'shop',pw:'shop123'});
  for(let i=1;i<=5;i++) users.push({id:'user'+i,email:'user'+i+'@gram.com',role:'user',pw:'user123'});
  return {shops,products,offers,users,
    getShops:()=>Promise.resolve(JSON.parse(JSON.stringify(shops))),
    getShop:(id)=>Promise.resolve(JSON.parse(JSON.stringify(shops.find(s=>s.id===id)))),
    getProducts:()=>Promise.resolve(JSON.parse(JSON.stringify(products))),
    getOffers:()=>Promise.resolve(JSON.parse(JSON.stringify(offers))),
    getUsers:()=>Promise.resolve(JSON.parse(JSON.stringify(users))),
    createShop:(payload)=>{payload.id='shop'+(shops.length+1);shops.push(payload);return Promise.resolve(payload)},
    updateShop:(id,payload)=>{const ix=shops.findIndex(s=>s.id===id);if(ix>-1)shops[ix]=Object.assign(shops[ix],payload);return Promise.resolve(shops[ix])},
    deleteShop:(id)=>{const ix=shops.findIndex(s=>s.id===id);if(ix>-1)shops.splice(ix,1);return Promise.resolve(true)},
    createProduct:(payload)=>{payload.id='p'+(products.length+1);products.push(payload);return Promise.resolve(payload)},
    createOffer:(payload)=>{payload.id='o'+(offers.length+1);offers.push(payload);return Promise.resolve(payload)}
  };
})();