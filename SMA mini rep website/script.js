/**
 * script.js — FoodHub Main Logic
 * Handles: Menu rendering, Cart, Order flow, Animations
 */

'use strict';

// ─── Fallback Menu Data ───────────────────────────────────────
const FALLBACK_MENU = [
  // Burgers
  { id: 'b1', name: 'Classic Smash Burger', description: 'Double smashed patty, cheddar, pickles, special sauce on brioche', price: 229, category: 'burgers', emoji: '🍔', rating: 4.8, is_popular: true, is_veg: false },
  { id: 'b2', name: 'Spicy Chicken Crunch', description: 'Crispy fried chicken, jalapeños, sriracha mayo, slaw', price: 199, category: 'burgers', emoji: '🍗', rating: 4.6, is_popular: false, is_veg: false },
  { id: 'b3', name: 'Mushroom Swiss Melt', description: 'Sautéed mushrooms, Swiss cheese, caramelized onions, truffle aioli', price: 219, category: 'burgers', emoji: '🍄', rating: 4.7, is_popular: false, is_veg: true },
  { id: 'b4', name: 'BBQ Bacon Stack', description: 'Smoky BBQ sauce, crispy bacon, caramelized onion rings', price: 259, category: 'burgers', emoji: '🥩', rating: 4.9, is_popular: true, is_veg: false },

  // Pizza
  { id: 'p1', name: 'Margherita Classica', description: 'San Marzano tomato, fresh mozzarella, hand-torn basil, EVOO', price: 299, category: 'pizza', emoji: '🍕', rating: 4.7, is_popular: false, is_veg: true },
  { id: 'p2', name: 'Pepperoni Feast', description: 'Loaded pepperoni, mozzarella, oregano on a crispy thin crust', price: 349, category: 'pizza', emoji: '🍕', rating: 4.9, is_popular: true, is_veg: false },
  { id: 'p3', name: 'Peri-Peri Paneer', description: 'Spiced paneer, capsicum, corn, peri-peri sauce, cheese blend', price: 329, category: 'pizza', emoji: '🧀', rating: 4.5, is_popular: false, is_veg: true },
  { id: 'p4', name: 'BBQ Chicken Fiesta', description: 'Tandoori chicken, onion, capsicum, BBQ drizzle', price: 369, category: 'pizza', emoji: '🍕', rating: 4.8, is_popular: true, is_veg: false },

  // Biryani
  { id: 'br1', name: 'Hyderabadi Dum Biryani', description: 'Slow-cooked basmati, saffron, caramelized onions, raita', price: 289, category: 'biryani', emoji: '🍛', rating: 4.9, is_popular: true, is_veg: false },
  { id: 'br2', name: 'Veg Dum Biryani', description: 'Garden vegetables, fragrant spices, mint, slow dum cooked', price: 249, category: 'biryani', emoji: '🫕', rating: 4.6, is_popular: false, is_veg: true },
  { id: 'br3', name: 'Prawn Biryani', description: 'Tiger prawns, coastal masala, coconut milk, basmati', price: 349, category: 'biryani', emoji: '🦐', rating: 4.8, is_popular: true, is_veg: false },

  // Rolls
  { id: 'r1', name: 'Paneer Tikka Roll', description: 'Chargrilled paneer, mint chutney, onion, in a flaky paratha', price: 149, category: 'rolls', emoji: '🌯', rating: 4.5, is_popular: false, is_veg: true },
  { id: 'r2', name: 'Chicken Seekh Roll', description: 'Juicy seekh kebab, green chutney, onions, squeeze of lemon', price: 169, category: 'rolls', emoji: '🥙', rating: 4.7, is_popular: true, is_veg: false },
  { id: 'r3', name: 'Egg Frankie', description: 'Masala egg, veggies, tangy sauce rolled in soft roti', price: 129, category: 'rolls', emoji: '🌮', rating: 4.4, is_popular: false, is_veg: false },

  // Chinese
  { id: 'c1', name: 'Veg Hakka Noodles', description: 'Wok-tossed noodles, veggies, soy-ginger sauce', price: 189, category: 'chinese', emoji: '🍜', rating: 4.4, is_popular: false, is_veg: true },
  { id: 'c2', name: 'Chilli Chicken (Dry)', description: 'Crispy chicken, bell peppers, spring onion, house chilli sauce', price: 229, category: 'chinese', emoji: '🥡', rating: 4.8, is_popular: true, is_veg: false },
  { id: 'c3', name: 'Manchow Soup', description: 'Hot and sour, crispy noodles on top, chicken/veg choice', price: 149, category: 'chinese', emoji: '🍲', rating: 4.5, is_popular: false, is_veg: false },
  { id: 'c4', name: 'Veg Fried Rice', description: 'Wok-fried rice, mixed veggies, scrambled egg, soy sauce', price: 179, category: 'chinese', emoji: '🍚', rating: 4.3, is_popular: false, is_veg: true },

  // Desserts
  { id: 'd1', name: 'Belgian Choco Lava', description: 'Warm dark chocolate centre, vanilla ice cream, cocoa dust', price: 189, category: 'desserts', emoji: '🍫', rating: 4.9, is_popular: true, is_veg: true },
  { id: 'd2', name: 'Gulab Jamun (4pcs)', description: 'Soft cottage cheese dumplings, rose syrup, pistachio', price: 99, category: 'desserts', emoji: '🍮', rating: 4.6, is_popular: false, is_veg: true },
  { id: 'd3', name: 'Mango Kulfi', description: 'Alphonso mango, creamy kulfi, rose petals', price: 129, category: 'desserts', emoji: '🍧', rating: 4.7, is_popular: true, is_veg: true },

  // Drinks
  { id: 'dr1', name: 'Mango Lassi', description: 'Thick yogurt, ripe Alphonso mango, hint of cardamom', price: 99, category: 'drinks', emoji: '🥭', rating: 4.8, is_popular: true, is_veg: true },
  { id: 'dr2', name: 'Masala Chaas', description: 'Spiced buttermilk, cumin, coriander, ginger', price: 79, category: 'drinks', emoji: '🥛', rating: 4.5, is_popular: false, is_veg: true },
  { id: 'dr3', name: 'Cold Coffee Frappe', description: 'Blended arabica, ice, cream, caramel swirl', price: 149, category: 'drinks', emoji: '☕', rating: 4.7, is_popular: false, is_veg: true },
  { id: 'dr4', name: 'Fresh Lime Soda', description: 'Zesty lime, sparkling water, black salt — sweet or salted', price: 69, category: 'drinks', emoji: '🍋', rating: 4.4, is_popular: false, is_veg: true },
];

// ─── Cart State ───────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('fh_cart') || '[]');
let menuData = [];
let currentCategory = 'all';
let searchQuery = '';

// ─── Utils ────────────────────────────────────────────────────
const saveCart = () => localStorage.setItem('fh_cart', JSON.stringify(cart));

const formatPrice = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0);

const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

const findCartItem = (id) => cart.find(i => i.id === id);

function showToast(msg, icon = '✅') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  const iconEl = toast.querySelector('.toast-icon');
  if (!toast) return;
  msgEl.textContent = msg;
  iconEl.textContent = icon;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('#cart-badge');
  const count = getCartCount();
  badges.forEach(b => {
    b.textContent = count;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (count > 0) b.classList.add('bump');
  });
}

// ─── Navbar scroll effect ─────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── MENU PAGE ────────────────────────────────────────────────
if (document.body.classList.contains('page-menu')) {
  initMenuPage();
}

async function initMenuPage() {
  updateCartBadge();
  setupCategories();
  setupSearch();

  // Try Supabase, fallback to local
  let data = null;
  if (window.FoodHubDB) {
    data = await window.FoodHubDB.fetchMenu();
  }
  menuData = data && data.length ? data : FALLBACK_MENU;

  // Hide skeleton, show grid
  setTimeout(() => {
    document.getElementById('skeleton-grid').style.display = 'none';
    const grid = document.getElementById('menu-grid');
    grid.style.display = 'grid';
    renderMenu();
  }, 900); // Skeleton for ~900ms to show it off
}

function setupCategories() {
  document.getElementById('categories').addEventListener('click', e => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    renderMenu();
  });
}

function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    searchQuery = input.value.trim().toLowerCase();
    renderMenu();
  });
}

function getFilteredMenu() {
  return menuData.filter(item => {
    const matchCat = currentCategory === 'all' || item.category === currentCategory;
    const matchSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery) || item.description?.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });
}

function renderMenu() {
  const grid = document.getElementById('menu-grid');
  const title = document.getElementById('section-title');
  const count = document.getElementById('section-count');
  if (!grid) return;

  const items = getFilteredMenu();

  const catLabels = {
    all: 'All Dishes', burgers: '🍔 Burgers', pizza: '🍕 Pizza',
    biryani: '🍛 Biryani', rolls: '🌯 Rolls', chinese: '🥡 Chinese',
    desserts: '🍰 Desserts', drinks: '🥤 Drinks'
  };

  if (title) title.textContent = searchQuery ? `Results for "${searchQuery}"` : (catLabels[currentCategory] || 'Dishes');
  if (count) count.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:4rem 0;color:var(--text-muted);">
        <div style="font-size:3rem;margin-bottom:1rem;">🔍</div>
        <p style="font-size:1rem;">No dishes found. Try a different search.</p>
      </div>`;
    return;
  }

  grid.innerHTML = items.map((item, i) => buildMenuCard(item, i)).join('');

  // Staggered reveal
  grid.querySelectorAll('.menu-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.06}s`;
  });

  // Bind events
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      addToCart(id, btn);
    });
  });

  grid.querySelectorAll('.card-fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
    });
  });
}

function buildMenuCard(item, idx) {
  const inCart = findCartItem(item.id);
  const qty = inCart ? inCart.qty : 0;
  const vegDot = item.is_veg
    ? `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--accent);margin-right:4px;vertical-align:middle;"></span>`
    : `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ef4444;margin-right:4px;vertical-align:middle;"></span>`;

  return `
    <div class="menu-card" data-id="${item.id}">
      <div class="card-img-wrap">
        ${item.image_url
          ? `<img src="${item.image_url}" alt="${item.name}" loading="lazy" />`
          : `<div class="card-emoji-placeholder">${item.emoji || '🍽️'}</div>`
        }
        <span class="card-badge">${item.category}</span>
        <button class="card-fav-btn" aria-label="Favourite">♡</button>
        ${item.is_popular ? `<span style="position:absolute;bottom:0.75rem;left:0.75rem;background:var(--accent);color:#000;font-size:0.65rem;font-weight:700;padding:0.2rem 0.55rem;border-radius:100px;">⚡ Popular</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-name">${item.name}</div>
        <div class="card-desc">${item.description || ''}</div>
        <div class="card-footer">
          <div>
            <div class="card-price">${formatPrice(item.price)}</div>
            <div class="card-rating" style="margin-top:0.2rem;">${vegDot}⭐ ${item.rating || '4.5'}</div>
          </div>
          ${qty > 0
            ? `<div class="cart-item-qty-controls" id="qty-ctrl-${item.id}">
                <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
                <span class="qty-num">${qty}</span>
                <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
               </div>`
            : `<button class="add-to-cart-btn" data-id="${item.id}">
                + Add
               </button>`
          }
        </div>
      </div>
    </div>`;
}

function addToCart(id, btn) {
  const item = menuData.find(m => m.id === id);
  if (!item) return;

  const existing = findCartItem(id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, emoji: item.emoji || '🍽️', category: item.category, qty: 1 });
  }

  saveCart();
  updateCartBadge();

  // Animate button
  if (btn) {
    btn.classList.add('adding');
    // Ripple
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    setTimeout(() => btn.classList.remove('adding'), 300);
  }

  showToast(`${item.name} added to cart! 🛒`);

  // Re-render card to show qty control
  setTimeout(() => {
    const card = document.querySelector(`.menu-card[data-id="${id}"]`);
    if (card) {
      const footer = card.querySelector('.card-footer');
      const existing2 = findCartItem(id);
      const newControl = document.createElement('div');
      newControl.className = 'cart-item-qty-controls';
      newControl.id = `qty-ctrl-${id}`;
      newControl.innerHTML = `
        <button class="qty-btn" data-action="dec" data-id="${id}">−</button>
        <span class="qty-num">${existing2.qty}</span>
        <button class="qty-btn" data-action="inc" data-id="${id}">+</button>`;
      const oldBtn = footer.querySelector('.add-to-cart-btn');
      if (oldBtn) oldBtn.replaceWith(newControl);
      newControl.querySelectorAll('.qty-btn').forEach(b => b.addEventListener('click', handleQtyChange));
    }
  }, 150);
}

function handleQtyChange(e) {
  const btn = e.currentTarget;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  const item = findCartItem(id);
  if (!item) return;

  if (action === 'inc') {
    item.qty++;
  } else {
    item.qty--;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
      saveCart();
      updateCartBadge();
      renderMenu();
      return;
    }
  }

  saveCart();
  updateCartBadge();

  // Update qty display
  const ctrl = document.getElementById(`qty-ctrl-${id}`);
  if (ctrl) ctrl.querySelector('.qty-num').textContent = item.qty;
}

// Also bind qty controls on qty ctrl elements added during render
document.addEventListener('click', e => {
  const btn = e.target.closest('.qty-btn');
  if (!btn || !document.body.classList.contains('page-menu')) return;
  handleQtyChange({ currentTarget: btn });
});

// ─── CART PAGE ────────────────────────────────────────────────
if (document.body.classList.contains('page-cart')) {
  initCartPage();
}

function initCartPage() {
  updateCartBadge();
  renderCart();
  setupCartEvents();
}

function renderCart() {
  const emptyEl = document.getElementById('empty-cart');
  const contentEl = document.getElementById('cart-content');
  const listEl = document.getElementById('cart-items-list');
  const countEl = document.getElementById('items-count');

  if (cart.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    if (contentEl) contentEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'grid';

  const totalItems = getCartCount();
  if (countEl) countEl.textContent = `${totalItems} Item${totalItems !== 1 ? 's' : ''}`;

  if (listEl) {
    listEl.innerHTML = cart.map((item, i) => `
      <div class="cart-item" data-id="${item.id}" style="animation-delay:${i * 0.08}s">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-cat">${item.category}</div>
        </div>
        <div class="cart-item-qty-controls">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
        <button class="remove-btn" data-id="${item.id}" title="Remove">✕</button>
      </div>`).join('');
  }

  updateOrderSummary();
}

function updateOrderSummary() {
  const subtotal = getCartTotal();
  const delivery = subtotal > 0 ? 30 : 0;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + taxes;

  const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  el('subtotal', formatPrice(subtotal));
  el('delivery-fee', subtotal > 0 ? formatPrice(delivery) : '₹0');
  el('taxes', formatPrice(taxes));
  el('grand-total', formatPrice(total));

  // Store total for order page
  localStorage.setItem('fh_last_total', total);
}

function setupCartEvents() {
  // Qty changes
  document.addEventListener('click', e => {
    if (!document.body.classList.contains('page-cart')) return;

    const qtyBtn = e.target.closest('.qty-btn');
    if (qtyBtn) {
      const id = qtyBtn.dataset.id;
      const action = qtyBtn.dataset.action;
      const item = findCartItem(id);
      if (!item) return;

      if (action === 'inc') {
        item.qty++;
        saveCart();
        updateCartBadge();
        renderCart();
      } else {
        item.qty--;
        if (item.qty <= 0) {
          removeCartItem(id);
        } else {
          saveCart();
          updateCartBadge();
          renderCart();
        }
      }
      return;
    }

    // Remove
    const removeBtn = e.target.closest('.remove-btn');
    if (removeBtn) {
      removeCartItem(removeBtn.dataset.id);
      return;
    }
  });

  // Clear cart
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = [];
      saveCart();
      updateCartBadge();
      renderCart();
      showToast('Cart cleared', '🗑️');
    });
  }

  // Promo
  const promoBtn = document.getElementById('promo-btn');
  if (promoBtn) {
    promoBtn.addEventListener('click', () => {
      const code = document.getElementById('promo-input').value.trim().toUpperCase();
      const hint = document.getElementById('promo-hint');
      if (code === 'FOODHUB20') {
        hint.textContent = '✅ 20% discount applied!';
        hint.style.color = 'var(--accent)';
        showToast('Promo code applied! 🎉');
      } else if (code === 'FIRST50') {
        hint.textContent = '✅ ₹50 off on your first order!';
        hint.style.color = 'var(--accent)';
        showToast('Promo code applied! 🎉');
      } else {
        hint.textContent = '❌ Invalid promo code.';
        hint.style.color = 'var(--danger, #ef4444)';
      }
    });
  }

  // Place Order
  const placeBtn = document.getElementById('place-order-btn');
  if (placeBtn) {
    placeBtn.addEventListener('click', async () => {
      if (cart.length === 0) { showToast('Add items to cart first!', '⚠️'); return; }

      placeBtn.disabled = true;
      placeBtn.innerHTML = '<span>Processing…</span>';

      const subtotal = getCartTotal();
      const delivery = 30;
      const taxes = Math.round(subtotal * 0.05);
      const total = subtotal + delivery + taxes;

      const orderData = {
        items: cart,
        subtotal,
        delivery_fee: delivery,
        taxes,
        total_price: total,
        status: 'confirmed',
      };

      let savedOrder = null;
      if (window.FoodHubDB) {
        savedOrder = await window.FoodHubDB.saveOrder(orderData);
      }

      const orderId = savedOrder?.id || ('FH' + Math.floor(Math.random() * 900000 + 100000));
      localStorage.setItem('fh_last_order_id', orderId);
      localStorage.setItem('fh_last_total', total);

      // Clear cart
      cart = [];
      saveCart();
      updateCartBadge();

      // Redirect
      window.location.href = 'order.html';
    });
  }
}

function removeCartItem(id) {
  const el = document.querySelector(`.cart-item[data-id="${id}"]`);
  if (el) {
    el.classList.add('removing');
    setTimeout(() => {
      cart = cart.filter(i => i.id !== id);
      saveCart();
      updateCartBadge();
      renderCart();
      showToast('Item removed from cart', '🗑️');
    }, 350);
  } else {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartBadge();
    renderCart();
  }
}

// ─── ORDER SUCCESS PAGE ───────────────────────────────────────
if (document.body.classList.contains('page-order')) {
  initOrderPage();
}

function initOrderPage() {
  updateCartBadge();

  const orderId = localStorage.getItem('fh_last_order_id') || ('FH' + Math.floor(Math.random() * 900000 + 100000));
  const total = localStorage.getItem('fh_last_total') || '0';

  const orderIdEl = document.getElementById('order-id');
  const orderTotalEl = document.getElementById('order-total');
  if (orderIdEl) orderIdEl.textContent = '#' + orderId;
  if (orderTotalEl) orderTotalEl.textContent = formatPrice(parseFloat(total));

  // Animated delivery tracker steps
  const steps = ['step1', 'step2', 'step3'];
  const lines = ['line1', 'line2', 'line3'];
  let stepIdx = 0;

  function activateNextStep() {
    if (stepIdx < steps.length) {
      const stepEl = document.getElementById(steps[stepIdx]);
      if (stepEl) stepEl.classList.add('active');
      if (stepIdx > 0) {
        const lineEl = document.getElementById(lines[stepIdx - 1]);
        if (lineEl) lineEl.classList.add('active');
      }
      stepIdx++;
      setTimeout(activateNextStep, 1800);
    }
  }
  setTimeout(activateNextStep, 1200);

  // Confetti
  runConfetti();

  // Clean up localStorage after showing
  localStorage.removeItem('fh_last_order_id');
  localStorage.removeItem('fh_last_total');
}

function runConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#22c55e', '#4ade80', '#ffffff', '#fbbf24', '#f472b6', '#60a5fa'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 6 + 3,
    d: Math.random() * 80 + 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    tilt: Math.random() * 10 - 10,
    tiltAngle: 0,
    tiltSpeed: Math.random() * 0.1 + 0.05,
    speed: Math.random() * 3 + 1.5,
    opacity: 1,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
      ctx.stroke();

      p.tiltAngle += p.tiltSpeed;
      p.y += p.speed;
      p.tilt = Math.sin(p.tiltAngle) * 12;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
      if (frame > 200) p.opacity = Math.max(0, p.opacity - 0.005);
    });
    ctx.globalAlpha = 1;
    frame++;
    if (frame < 350) requestAnimationFrame(draw);
    else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(draw);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
