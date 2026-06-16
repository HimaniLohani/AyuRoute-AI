/* eslint-disable */
import { useEffect, useState } from 'react';

const MEDICINE_DATA = [
  { id: 'm1', name: 'Paracetamol 500mg', price: 40, category: 'Fever', desc: 'Fast relief from fever and body aches.', tag: 'Best Seller' },
  { id: 'm2', name: 'Amoxicillin 250mg', price: 110, category: 'Antibiotic', desc: 'Doctor prescribed broad-spectrum antibiotic.', tag: 'Prescription Req.' },
  { id: 'm3', name: 'Instant Antacid Gel', price: 85, category: 'Digestive', desc: 'Relieves acidity and heartburn in 2 minutes.', tag: '10-Min Delivery' },
  { id: 'm4', name: 'Elastic Crepe Bandage', price: 65, category: 'First-Aid', desc: 'Premium support for sprains and muscle strains.', tag: 'Essential' },
  { id: 'm5', name: 'Cetirizine 10mg (Allergy)', price: 35, category: 'Cold', desc: 'Non-drowsy relief from running nose and sneezing.', tag: 'Pocket Friendly' }
];

export default function Pharmacy({ isDark = true }) {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [orderStatus, setOrderStatus] = useState(null); // null | 'paying' | 'tracking'
  const [timeLeft, setTimeLeft] = useState(10); // 10 minutes countdown

  const theme = {
    cardBg: isDark ? 'rgba(15, 23, 42, 0.7)' : '#ffffff',
    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
    textMain: isDark ? '#ffffff' : '#0f172a',
    textSub: isDark ? '#94a3b8' : '#475569',
    bgLight: isDark ? '#020617' : '#f1f5f9'
  };

  // 🛒 Cart Logic
  const addToCart = (med) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        return prev.map(item => item.id === med.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...med, qty: 1 }];
    });
  };

  const updateQty = (id, amount) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + amount;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // 💳 Payment & Checkout Trigger
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderStatus('paying');
    setTimeout(() => {
      setOrderStatus('tracking');
      setCart([]); // Clear cart after success
    }, 2000);
  };

  // ⏱️ Hyperlocal 10-Minute Timer Simulation
  useEffect(() => {
    if (orderStatus !== 'tracking' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 4000); // Accelerated speed for portfolio visualization
    return () => clearInterval(timer);
  }, [orderStatus, timeLeft]);

  // Dynamic Status Text based on minutes left
  const getTrackingStatus = () => {
    if (timeLeft > 8) return "📦 Order packed by Cloud Pharmacy Pharmacist";
    if (timeLeft > 4) return "🚴 Delivery partner assigned & speeding near your sector";
    if (timeLeft > 0) return "🏁 Agent entering your colony gate - Keep phone handy!";
    return "🎉 Package delivered at your doorstep!";
  };

  const filteredMeds = activeTab === 'All' 
    ? MEDICINE_DATA 
    : MEDICINE_DATA.filter(m => m.category === activeTab);

  return (
    <div style={{ padding: '20px 0', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 🚴 LIVE TRACKING COUNTDOWN PANEL */}
      {orderStatus === 'tracking' && (
        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: '0 10px 20px -5px rgba(16,185,129,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18 }}>⚡ Hyperlocal 10-Min Flash Delivery Active</h3>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: 13 }}>{getTrackingStatus()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 26, fontWeight: 900, fontFamily: 'monospace' }}>{timeLeft}:00</span>
              <div style={{ fontSize: 9, opacity: 0.8, textTransform: 'uppercase' }}>Mins Left</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 10, marginTop: 12, overflow: 'hidden' }}>
            <div style={{ width: `${(timeLeft / 10) * 100}%`, height: '100%', background: '#fff', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        
        {/* LEFT COLUMN: SHOPPING AREA */}
        <div>
          <h2 style={{ margin: '0 0 4px 0', color: theme.textMain }}>💊 10-Minute Pharmacy Store</h2>
          <p style={{ color: theme.textSub, margin: '0 0 20px 0', fontSize: 14 }}>Get emergency medicines delivered under 10 minutes flat from the nearest medical hub.</p>

          {/* Category Filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {['All', 'Fever', 'Antibiotic', 'Digestive', 'First-Aid', 'Cold'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveTab(cat)}
                style={{ padding: '8px 16px', borderRadius: 20, border: activeTab === cat ? '1px solid #10b981' : theme.border, background: activeTab === cat ? 'rgba(16,185,129,0.12)' : theme.cardBg, color: activeTab === cat ? '#10b981' : theme.textSub, fontWeight: 600, cursor: 'pointer' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Medicine Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredMeds.map(med => (
              <div key={med.id} style={{ background: theme.cardBg, border: theme.border, borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ maxWidth: '70%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: theme.textMain, fontSize: 15 }}>{med.name}</span>
                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{med.tag}</span>
                  </div>
                  <div style={{ fontSize: 12, color: theme.textSub, marginTop: 4 }}>{med.desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981', marginBottom: 8 }}>₹{med.price}</div>
                  <button 
                    onClick={() => addToCart(med)}
                    style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16,185,129,0.1)' }}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: BASKET / CHECKOUT AREA */}
        <div style={{ background: theme.cardBg, border: theme.border, borderRadius: 16, padding: 20, height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 14px 0', color: theme.textMain, display: 'flex', justifyContent: 'space-between' }}>
            <span>🛒 My Cart</span>
            <span style={{ fontSize: 12, background: theme.bgLight, padding: '2px 8px', borderRadius: 6 }}>{cart.length} items</span>
          </h3>

        {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSub, fontSize: 13 }}>
            Your basket is empty.<br/>Add medical supplies to activate instant delivery checkout.
            </div>
        ) : (
            <div>
              {/* Cart Items List */}
              <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: theme.border }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMain }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>₹{item.price * item.qty}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: theme.border, background: theme.bgLight, color: theme.textMain, cursor: 'pointer' }}>-</button>
                      <span style={{ fontSize: 13, fontWeight: 700, color: theme.textMain }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: theme.border, background: theme.bgLight, color: theme.textMain, cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div style={{ background: theme.bgLight, padding: 12, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span>Item Total</span><span>₹{totalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                  <span>10-Min Flash Delivery Fee</span><span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
                </div>
                <hr style={{ border: 'none', borderTop: theme.border, margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14, color: theme.textMain }}>
                  <span>Grand Total</span><span>₹{totalAmount}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={orderStatus === 'paying'}
                style={{ width: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', color: '#fff', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontSize: 14 }}
              >
                {orderStatus === 'paying' ? '🔒 Processing Gateway Security...' : `💳 Pay & Dispatch in 10-Mins`}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}