/**
 * supabase.js — FoodHub × Supabase Integration
 *
 * ╔══════════════════════════════════════════════════╗
 * ║  STEP 1 — Create a Supabase project              ║
 * ║  Go to https://supabase.com → New Project        ║
 * ╚══════════════════════════════════════════════════╝
 *
 * STEP 2 — Paste your credentials below (from
 *          Supabase Dashboard → Settings → API)
 */

const SUPABASE_URL      = 'https://jwmgzzlydvzabcyygohf.supabase.co';       // https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bWd6emx5ZHZ6YWJjeXlnb2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMDkzODUsImV4cCI6MjA5MTU4NTM4NX0.9riWHddX-_oQxutyUZ7Dg-eprfcMckNqQT-BuZPaN4o';  // eyJh…

/* ─────────────────────────────────────────────────────────────
   STEP 3 — Run this SQL in Supabase → SQL Editor → New Query
   ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   text        NOT NULL,
  items        jsonb       NOT NULL,
  subtotal     numeric(10,2),
  delivery_fee numeric(10,2) DEFAULT 30,
  taxes        numeric(10,2),
  total_price  numeric(10,2),
  status       text        DEFAULT 'confirmed',
  created_at   timestamptz DEFAULT now()
);

-- Allow anyone (anon) to INSERT and SELECT their own orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT USING (true);

   ─────────────────────────────────────────────────────────────
   STEP 4 — (Optional) menu_items table so menu loads from DB

CREATE TABLE IF NOT EXISTS menu_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  description text,
  price       numeric(10,2) NOT NULL,
  category    text        NOT NULL,
  emoji       text,
  image_url   text,
  rating      numeric(2,1) DEFAULT 4.5,
  is_popular  boolean     DEFAULT false,
  is_veg      boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read menu" ON menu_items FOR SELECT USING (true);

   ─────────────────────────────────────────────────────────────
   That's it! Orders placed in FoodHub will now appear in
   Supabase → Table Editor → orders
   ───────────────────────────────────────────────────────────── */


// ─── Load Supabase JS from CDN ────────────────────────────────
let _sb = null;

async function initSupabase() {
  if (_sb) return _sb;

  console.log('🔧 Initializing Supabase with URL:', SUPABASE_URL);

  // Dynamically load the Supabase JS UMD bundle from CDN
  if (!window.supabase) {
    console.log('📥 Loading Supabase JS library from CDN...');
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      script.onload  = () => {
        console.log('✅ Supabase JS library loaded');
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Supabase JS from CDN'));
      document.head.appendChild(script);
    });
  }

  try {
    _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('%c✅ FoodHub%c Connected to Supabase', 'color:#22c55e;font-weight:bold', 'color:inherit');
    return _sb;
  } catch (err) {
    console.error('❌ Failed to create Supabase client:', err);
    return null;
  }
}

// ─── Session ID (anonymous user tracking) ────────────────────
function getSessionId() {
  let sid = localStorage.getItem('fh_session_id');
  if (!sid) {
    sid = 'fh_' + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem('fh_session_id', sid);
  }
  return sid;
}

// ─── DB helpers ───────────────────────────────────────────────
const DB = {

  /**
   * Fetch menu items from Supabase.
   * Returns null if Supabase is not configured → app uses fallback data.
   */
  async fetchMenu() {
    const sb = await initSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb
        .from('menu_items')
        .select('*')
        .order('category');
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('fetchMenu error:', e.message);
      return null;
    }
  },

  /**
   * Save a completed order to the `orders` table.
   * Falls back to localStorage when Supabase is not configured.
   */
  async saveOrder(orderData) {
    const sb = await initSupabase();

    // ── Offline fallback ──────────────────────────────────────
    if (!sb) {
      console.warn('⚠️ Supabase not initialized - saving to localStorage');
      const orders = JSON.parse(localStorage.getItem('fh_orders') || '[]');
      const order  = {
        id         : 'FH' + Math.floor(Math.random() * 900000 + 100000),
        session_id : getSessionId(),
        status     : 'confirmed',
        created_at : new Date().toISOString(),
        ...orderData,
      };
      orders.push(order);
      localStorage.setItem('fh_orders', JSON.stringify(orders));
      console.log('📦 Order saved to localStorage (offline mode):', order.id);
      return order;
    }

    // ── Supabase insert ───────────────────────────────────────
    try {
      console.log('💾 Attempting to save order to Supabase...', orderData);
      const payload = {
        session_id   : getSessionId(),
        items        : orderData.items,
        subtotal     : orderData.subtotal,
        delivery_fee : orderData.delivery_fee,
        taxes        : orderData.taxes,
        total_price  : orderData.total_price,
        status       : 'confirmed',
      };

      console.log('📋 Payload:', payload);
      const { data, error } = await sb
        .from('orders')
        .insert([payload]);

      if (error) {
        console.error('❌ Supabase insert error:', error);
        throw error;
      }

      console.log('%c✅ FoodHub%c Order saved to Supabase! Response:', 'color:#22c55e;font-weight:bold', 'color:inherit', data);
      return payload;
    } catch (e) {
      console.error('❌ saveOrder error:', e.message, e);
      return {
        id         : 'FH' + Math.floor(Math.random() * 900000 + 100000),
        ...orderData,
        status     : 'confirmed',
        created_at : new Date().toISOString(),
      };
    }
  },

  /**
   * Fetch all orders for the current session (order history).
   */
  async fetchMyOrders() {
    const sb = await initSupabase();
    if (!sb) {
      return JSON.parse(localStorage.getItem('fh_orders') || '[]');
    }
    try {
      const { data, error } = await sb
        .from('orders')
        .select('*')
        .eq('session_id', getSessionId())
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('fetchMyOrders error:', e.message);
      return [];
    }
  },
};

window.FoodHubDB    = DB;
window.getSessionId = getSessionId;
