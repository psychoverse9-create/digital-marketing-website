// scripts.js - product rendering, cart, modal, and simple UI handlers
(function(){
  // Expanded product catalog (sample)
  const products = [
    { id: 'p1', title: 'Smart LED Bulb (9W)', price: 249, img: 'https://images.unsplash.com/photo-1581091012184-8e3f1b7bd8a8?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', type:'physical', desc:'Energy efficient smart bulb with app control.' },
    { id: 'p2', title: 'Power Bank 10000mAh', price: 899, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', type:'physical', desc:'Compact high-capacity power bank.' },
    { id: 'p3', title: 'Extension Socket 4-way', price: 399, img: 'https://images.unsplash.com/photo-1582719478250-6e6a6a3b2c3b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', type:'physical', desc:'Durable extension socket with surge protection.' },
    { id: 'p4', title: 'Smart Switch (2-gang)', price: 1299, img: 'https://images.unsplash.com/photo-1582719478260-9f0b2e8b1a1a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', type:'physical', desc:'WiFi enabled 2-gang smart switch.' },
    { id: 'ebook-1', title: 'Electrical Safety eBook', price: 199, img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', type:'digital', desc:'Concise guide on electrical safety and best practices.' },
    { id: 'ebook-2', title: 'Quick Reference: Wiring Codes', price: 299, img: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', type:'digital', desc:'Reference e-book for local wiring codes.' },
    { id: 'course-1', title: "Mini Course: Home Wiring by Syed Ifhaan", price: 599, img: 'https://images.unsplash.com/photo-1555685812-4b943f1f2f97?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', type:'digital', desc:'Short, practical lessons to get you started safely.' },
    { id: 'kit-1', title: 'Beginner Electrical Kit', price: 1299, img: 'https://images.unsplash.com/photo-1580910051074-4b6a9a1b3c1b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', type:'physical', desc:'Starter kit with tester, wires, and connectors.' }
  ];

  // DOM refs
  const productsGrid = document.getElementById('productsGrid');
  const cartCountEl = document.getElementById('cartCount');
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const searchInput = document.getElementById('search');

  let cart = loadCart();
  let orderHistory = loadHistory();
  const productModal = document.getElementById('productModal');
  const closeProductModalBtn = document.getElementById('closeProductModal');
  const productTitle = document.getElementById('productTitle');
  const productImg = document.getElementById('productImg');
  const productDesc = document.getElementById('productDesc');
  const productPrice = document.getElementById('productPrice');
  const productQty = document.getElementById('productQty');
  const productAddBtn = document.getElementById('productAddBtn');
  const productBuyBtn = document.getElementById('productBuyBtn');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNav = document.getElementById('mobileNav');
  const filterType = document.getElementById('filterType');
  const sortBy = document.getElementById('sortBy');
  const viewHistoryBtn = document.getElementById('viewHistory');
  const historyModal = document.getElementById('historyModal');
  const closeHistory = document.getElementById('closeHistory');
  const historyBody = document.getElementById('historyBody');
  const toggleThemeBtn = document.getElementById('toggleTheme');

  function loadCart(){
    try{ const raw = localStorage.getItem('dm_cart'); return raw? JSON.parse(raw) : {}; }catch(e){return {}}
  }
  function saveCart(){ localStorage.setItem('dm_cart', JSON.stringify(cart)); }
  function saveHistory(){ localStorage.setItem('dm_history', JSON.stringify(orderHistory)); }
  function loadHistory(){ try{ const raw = localStorage.getItem('dm_history'); return raw? JSON.parse(raw): []; }catch(e){return []} }

  function renderProducts(list){
    productsGrid.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img loading="lazy" src="${p.img}" alt="${p.title}">
        <h4>${p.title}</h4>
        <p class="muted">${p.desc}</p>
        <div class="card-actions">
          <div class="price">₹${p.price}</div>
          <div>
            <button class="btn outline" data-id="${p.id}" aria-label="View">Details</button>
            <button class="btn primary" data-add="${p.id}">Add</button>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

  function findProduct(id){ return products.find(p=>p.id===id); }

  function addToCart(id, qty=1){
    cart[id] = (cart[id] || 0) + qty;
    saveCart();
    renderCartCount();
  }
  // animate add-to-cart: clone image and fly to cart
  function animateAddToCart(imgEl){
    if(!imgEl) return;
    const clone = imgEl.cloneNode(true);
    clone.className = 'flying-img';
    const rect = imgEl.getBoundingClientRect();
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    document.body.appendChild(clone);
    const cartRect = cartBtn.getBoundingClientRect();
    requestAnimationFrame(()=>{
      clone.style.transition = 'transform 700ms cubic-bezier(.2,.9,.2,1), opacity 700ms ease';
      const dx = cartRect.left + cartRect.width/2 - (rect.left + rect.width/2);
      const dy = cartRect.top + cartRect.height/2 - (rect.top + rect.height/2);
      clone.style.transform = `translate(${dx}px, ${dy}px) scale(.18)`;
      clone.style.opacity = '0.08';
    });
    setTimeout(()=>{ try{ clone.remove(); }catch(e){} cartBtn.classList.remove('cart-bounce'); void cartBtn.offsetWidth; cartBtn.classList.add('cart-bounce'); }, 720);
  }
  function removeFromCart(id){ if(cart[id]){ delete cart[id]; saveCart(); renderCartCount(); } }

  function renderCartCount(){
    const count = Object.values(cart).reduce((s,q)=>s+q,0);
    cartCountEl.textContent = count;
  }

  function renderCartItems(){
    cartItemsEl.innerHTML = '';
    const ids = Object.keys(cart);
    if(ids.length===0){ cartItemsEl.innerHTML = '<p class="muted">Your cart is empty.</p>'; cartTotalEl.textContent='₹0'; return; }
    let total = 0;
    ids.forEach(id => {
      const qty = cart[id];
      const p = findProduct(id) || {title:id, price:0, img:''};
      const subtotal = p.price * qty; total += subtotal;
      const div = document.createElement('div'); div.className='cart-item';
      div.innerHTML = `<img src="${p.img}" alt="${p.title}">
        <div style="flex:1">
          <div><strong>${p.title}</strong></div>
          <div class="muted">₹${p.price} × <button class="btn outline qty-decrease" data-id="${id}">-</button> ${qty} <button class="btn outline qty-increase" data-id="${id}">+</button> = ₹${subtotal}</div>
        </div>
        <div>
          <button class="btn outline" data-remove="${id}">Remove</button>
        </div>`;
      cartItemsEl.appendChild(div);
    });
    cartTotalEl.textContent = `₹${total}`;
  }

  function openCart(){ cartModal.setAttribute('aria-hidden','false'); renderCartItems(); }
  function closeCartModal(){ cartModal.setAttribute('aria-hidden','true'); }

  function checkout(){
    const items = Object.keys(cart).map(id=>({ product: findProduct(id), qty: cart[id] }));
    if(items.length===0){ alert('Your cart is empty'); return; }
    const total = items.reduce((s,it)=>s + (it.product?.price||0) * it.qty, 0);
    // record order
    const order = { id: 'ord_' + Date.now(), date: new Date().toISOString(), items, total };
    orderHistory.unshift(order);
    saveHistory();
    alert('Order placed. Total: ₹' + total + '\nThank you — this is a simulated checkout.');
    // show quick download for digital
    const digital = items.filter(i=>i.product && i.product.type==='digital');
    if(digital.length){
      let msg = 'Digital items:\n';
      digital.forEach(d=> msg += `${d.product.title} — Download: https://example.com/download/${d.product.id}\n`);
      alert(msg);
    }
    cart = {};
    saveCart();
    renderCartCount();
    renderCartItems();
    closeCartModal();
  }

  // UI wiring
  document.addEventListener('click', (e)=>{
    const add = e.target.closest('[data-add]');
    if(add){
      const id = add.getAttribute('data-add');
      addToCart(id);
      renderCartItems();
      // try to find source image in card
      const card = add.closest('.card');
      const img = card && card.querySelector('img');
      animateAddToCart(img);
      return;
    }
    const remove = e.target.closest('[data-remove]');
    if(remove){ removeFromCart(remove.getAttribute('data-remove')); renderCartItems(); return; }
    const inc = e.target.closest('.qty-increase');
    if(inc){ const id = inc.getAttribute('data-id'); cart[id] = (cart[id]||0)+1; saveCart(); renderCartItems(); renderCartCount(); return; }
    const dec = e.target.closest('.qty-decrease');
    if(dec){ const id = dec.getAttribute('data-id'); if(cart[id]>1){ cart[id]--; } else { delete cart[id]; } saveCart(); renderCartItems(); renderCartCount(); return; }
  });

  cartBtn.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartModal);
  checkoutBtn.addEventListener('click', checkout);

  // mobile nav toggle
  mobileNavToggle.addEventListener('click', ()=>{
    const expanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
    mobileNavToggle.setAttribute('aria-expanded', String(!expanded));
    mobileNav.setAttribute('aria-hidden', String(expanded));
  });

  // product detail modal handling
  productsGrid.addEventListener('click', (e)=>{
    const d = e.target.closest('[data-id]');
    if(!d) return;
    const id = d.getAttribute('data-id');
    const p = findProduct(id);
    if(p) openProductModal(p);
  });

  function openProductModal(p){
    productTitle.textContent = p.title;
    productImg.src = p.img;
    productImg.alt = p.title;
    productDesc.textContent = p.desc;
    productPrice.textContent = '₹' + p.price;
    productQty.value = 1;
    productAddBtn.setAttribute('data-add', p.id);
    productBuyBtn.setAttribute('data-buy', p.id);
    productModal.setAttribute('aria-hidden','false');
  }
  function closeProductModal(){ productModal.setAttribute('aria-hidden','true'); }
  closeProductModalBtn.addEventListener('click', closeProductModal);

  productAddBtn.addEventListener('click', ()=>{
    const id = productAddBtn.getAttribute('data-add');
    const qty = Math.max(1, parseInt(productQty.value,10)||1);
    addToCart(id, qty);
    renderCartItems();
    animateAddToCart(productImg);
    // small non-blocking whisper
    setTimeout(()=>{ const prev = document.querySelector('.toast'); if(prev) prev.remove(); const t = document.createElement('div'); t.className='toast'; t.textContent='Added to cart'; t.style.position='fixed'; t.style.right='18px'; t.style.bottom='20px'; t.style.padding='10px 14px'; t.style.background='linear-gradient(90deg,var(--neon-cyan),var(--neon-magenta))'; t.style.color='#051018'; t.style.borderRadius='10px'; t.style.boxShadow='0 10px 30px rgba(0,0,0,0.5)'; document.body.appendChild(t); setTimeout(()=>t.remove(),1400); }, 220);
  });
  productBuyBtn.addEventListener('click', ()=>{
    const id = productBuyBtn.getAttribute('data-buy');
    const qty = Math.max(1, parseInt(productQty.value,10)||1);
    addToCart(id, qty);
    renderCartItems();
    animateAddToCart(productImg);
    setTimeout(openCart, 260);
  });

  // reveal on scroll setup
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('reveal'); revealObserver.unobserve(entry.target); }
    });
  }, {threshold: 0.12});

  // observe cards and hero copy
  function observeReveals(){
    document.querySelectorAll('.card').forEach(el=>{
      revealObserver.observe(el);
    });
    const heroCopy = document.querySelector('.hero-copy'); if(heroCopy) revealObserver.observe(heroCopy);
  }

  // search filter with debounce
  function debounce(fn, wait=250){ let t; return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), wait); }; }
  const doSearch = debounce((q)=>{
    q = q.trim().toLowerCase();
    if(!q) return applyFilters();
    const filtered = products.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    renderProducts(filtered);
  }, 220);
  searchInput.addEventListener('input', (e)=> doSearch(e.target.value));

  // filters & sort
  function applyFilters(){
    const type = filterType.value;
    const sort = sortBy.value;
    let out = products.slice();
    if(type !== 'all') out = out.filter(p=>p.type === type);
    if(sort === 'price-asc') out.sort((a,b)=>a.price-b.price);
    if(sort === 'price-desc') out.sort((a,b)=>b.price-a.price);
    renderProducts(out);
  }
  filterType.addEventListener('change', applyFilters);
  sortBy.addEventListener('change', applyFilters);

  // order history
  viewHistoryBtn.addEventListener('click', ()=>{
    renderHistory();
    historyModal.setAttribute('aria-hidden','false');
  });
  closeHistory.addEventListener('click', ()=> historyModal.setAttribute('aria-hidden','true'));
  function renderHistory(){
    if(!orderHistory || orderHistory.length===0){ historyBody.innerHTML = '<p class="muted">No orders yet.</p>'; return; }
    historyBody.innerHTML = '';
    orderHistory.forEach(o => {
      const div = document.createElement('div');
      div.style.padding='8px 0';
      div.innerHTML = `<strong>${o.id}</strong> — ${new Date(o.date).toLocaleString()} — ₹${o.total}`;
      historyBody.appendChild(div);
    });
  }

  // theme toggle
  toggleThemeBtn.addEventListener('click', ()=>{
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? '' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.body.setAttribute('data-theme', next);
  });

  // contact form
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Thanks! Your message was received. We will reply to ' + document.getElementById('email').value);
    contactForm.reset();
  });

  // subscribe
  document.getElementById('subscribeBtn').addEventListener('click', ()=>{
    const em = document.getElementById('subscribeEmail').value.trim();
    if(!em) return alert('Enter an email');
    alert('Subscribed ' + em + ' — you will receive updates.');
    document.getElementById('subscribeEmail').value = '';
  });

  // course buy button(s)
  document.querySelectorAll('button[data-product-id]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-product-id');
      addToCart(id);
      alert('Added course to cart. Open cart to checkout.');
    });
  });

  // small helper
  window.scrollTo = (sel)=>{ const el = document.querySelector(sel); if(el) el.scrollIntoView({behavior:'smooth'}); };

  // set default neon-dark theme
  document.documentElement.setAttribute('data-theme','dark');
  document.body.setAttribute('data-theme','dark');

  // render initial
  renderProducts(products);
  renderCartCount();
  document.getElementById('year').textContent = new Date().getFullYear();
  // after rendering, set delays and observe for reveal animations
  document.querySelectorAll('.card').forEach((c,i)=>{ c.style.setProperty('--delay', (i*80)+'ms'); c.setAttribute('data-delay',''); c.classList.add('reveal-on-scroll'); });
  observeReveals();

})();
