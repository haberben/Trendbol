import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Minus, ShoppingBag, ShieldAlert, Sparkles, Tag } from 'lucide-react';

export default function Cart({ setActivePage, setSelectedProduct }) {
  const { cart, updateCartQuantity, removeFromCart, virtualCard, triggerLimitBoostAd } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
  
  // Coupon matching
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'DOPAMIN50') {
      setAppliedDiscountPercent(50);
      setCouponMessage({ type: 'success', text: '%50 Dopamin İndirimi Uygulandı! 🧡' });
    } else if (code === 'BEDAVA') {
      setAppliedDiscountPercent(90);
      setCouponMessage({ type: 'success', text: '%90 Dev Çılgınlık İndirimi Uygulandı! 🥳' });
    } else if (code) {
      setAppliedDiscountPercent(15);
      setCouponMessage({ type: 'success', text: `"%15 Kupon İndirimi Uygulandı!` });
    } else {
      setAppliedDiscountPercent(0);
      setCouponMessage(null);
    }
  };

  const discountAmount = Math.floor(subtotal * (appliedDiscountPercent / 100));
  const afterDiscountSubtotal = subtotal - discountAmount;
  const shippingCost = afterDiscountSubtotal > 200 || afterDiscountSubtotal === 0 ? 0 : 39.99;
  const total = Math.floor(afterDiscountSubtotal + shippingCost);

  const isLimitInsufficient = virtualCard.limit < total;

  if (cart.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '40px 16px', textAlign: 'center' }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '60px 16px',
          boxShadow: 'var(--shadow-sm)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'var(--brand-light)',
            color: 'var(--brand)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}>
            <ShoppingBag size={32} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Sepetiniz Boş</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            Sepetinizde henüz ürün bulunmuyor. Trendbol'un harika popüler ürünlerini sepetinize ekleyerek alışveriş simülasyonuna başlayabilirsiniz!
          </p>
          <button 
            onClick={() => setActivePage('home')}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Alışverişe Başla
          </button>
        </div>
      </div>
    );
  }

  const handleCheckoutClick = () => {
    // Navigate to checkout page
    // We will save the applied discount percentage in localStorage or context, but since this is a frontend app, we can just pass it or calculate it locally. We can write a simple checkout page that reads it. Or since checkout is the next page, we can set state. Let's redirect to checkout.
    setActivePage('checkout');
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setActivePage('detail');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 16px', paddingBottom: '80px' }}>
      
      <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>Sepetim ({cart.length} Ürün)</h2>

      {/* Grid Layout: Cart Items List vs Cart Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '24px',
        alignItems: 'start'
      }}
      className="cart-grid-responsive"
      >
        
        {/* Left Side: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map((item, index) => (
            <div 
              key={`${item.product.id}-${item.selectedSize || 'nosize'}`}
              style={{
                backgroundColor: 'white',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                gap: '16px',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              
              {/* Product Thumbnail */}
              <div 
                onClick={() => handleProductSelect(item.product)}
                style={{ width: '80px', height: '110px', overflow: 'hidden', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}
              >
                <img src={item.product.images[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Item Info details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 
                    onClick={() => handleProductSelect(item.product)}
                    style={{ fontSize: '14px', fontWeight: '700', lineHeight: '1.4', marginBottom: '4px', cursor: 'pointer' }}
                  >
                    <span style={{ color: 'var(--brand)', marginRight: '4px' }}>{item.product.brand}</span>
                    <span style={{ color: 'var(--text-sub)' }}>{item.product.name.replace(item.product.brand, '').trim()}</span>
                  </h4>
                  {item.selectedSize && (
                    <span style={{ fontSize: '11.5px', backgroundColor: 'var(--bg-sub)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-sub)', fontWeight: 'bold' }}>
                      Beden: {item.selectedSize}
                    </span>
                  )}
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Satıcı: <span style={{ color: 'var(--brand)', fontWeight: '500' }}>Trendbol</span>
                  </p>
                </div>

                {/* Controls (Qty Adjuster & Delete) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                      style={{ padding: '6px 10px', backgroundColor: '#fafafa', color: 'var(--text-sub)' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ padding: '0 12px', fontSize: '13px', fontWeight: '700' }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                      style={{ padding: '6px 10px', backgroundColor: '#fafafa', color: 'var(--text-sub)' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                    style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                    title="Sepetten Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>

              {/* Price item right */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flexShrink: 0 }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--brand)' }}>
                  {(item.product.discountPrice * item.quantity).toLocaleString('tr-TR')} TL
                </span>
                {item.product.discountPercent > 0 && (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {(item.product.price * item.quantity).toLocaleString('tr-TR')} TL
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Right Side: Order Summary Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Summary Panel */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Sipariş Özeti
            </h3>

            {/* Calculations lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--text-sub)' }}>
                <span>Ürünlerin Toplamı:</span>
                <span>{subtotal.toLocaleString('tr-TR')} TL</span>
              </div>
              
              {appliedDiscountPercent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--success)', fontWeight: 'bold' }}>
                  <span>Kupon İndirimi (%{appliedDiscountPercent}):</span>
                  <span>-{discountAmount.toLocaleString('tr-TR')} TL</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--text-sub)' }}>
                <span>Kargo Toplamı:</span>
                <span>{shippingCost === 0 ? 'Bedava' : `${shippingCost.toLocaleString('tr-TR')} TL`}</span>
              </div>
              
              {shippingCost > 0 && (
                <p style={{ fontSize: '11px', color: 'var(--brand)', marginTop: '-8px' }}>
                  *200 TL ve üzeri siparişlerde kargo bedava! (Kalan: {Math.max(0, 200 - afterDiscountSubtotal).toLocaleString('tr-TR')} TL)
                </p>
              )}
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: '#111', marginBottom: '20px' }}>
              <span>Ödenecek Tutar:</span>
              <span style={{ color: 'var(--brand)' }}>{total.toLocaleString('tr-TR')} TL</span>
            </div>

            {/* Sanal Limit Check details */}
            <div style={{
              backgroundColor: isLimitInsufficient ? 'var(--error-light)' : 'var(--success-light)',
              border: `1px solid ${isLimitInsufficient ? '#fca5a5' : '#bbf7d0'}`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isLimitInsufficient ? 'var(--error)' : 'var(--success)', fontWeight: 'bold', marginBottom: '4px' }}>
                <ShieldAlert size={14} />
                <span>{isLimitInsufficient ? 'Bakiye Yetersiz!' : 'Kart Limiti Yeterli'}</span>
              </div>
              <p style={{ color: 'var(--text-sub)' }}>
                Sanal limitiniz: <strong>{virtualCard.limit.toLocaleString('tr-TR')} TL</strong>. Ödeme yapmak için {isLimitInsufficient ? `${(total - virtualCard.limit).toLocaleString('tr-TR')} TL daha limite ihtiyacınız var.` : 'limitiniz uygundur.'}
              </p>
              
              {isLimitInsufficient && (
                <button 
                  onClick={() => triggerLimitBoostAd()}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '6px 0', fontSize: '11.5px', borderRadius: '4px', marginTop: '8px', backgroundColor: 'var(--error)' }}
                >
                  <Sparkles size={11} />
                  Limit Boost Yap (+3000 TL)
                </button>
              )}
            </div>

            {/* Proceed checkout CTA */}
            <button 
              onClick={handleCheckoutClick}
              disabled={isLimitInsufficient}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px 0', borderRadius: '8px', fontSize: '14.5px' }}
            >
              Sepeti Onayla
            </button>
          </div>

          {/* Coupon Code panel */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} style={{ color: 'var(--brand)' }} />
              İndirim Kuponu Ekle
            </h4>
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Örn: DOPAMIN50 veya BEDAVA"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '12.5px'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-outline"
                style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '12.5px' }}
              >
                Uygula
              </button>
            </form>
            {couponMessage && (
              <p style={{
                color: couponMessage.type === 'success' ? 'var(--success)' : 'var(--error)',
                fontSize: '12px',
                fontWeight: 'bold',
                marginTop: '8px'
              }}>
                {couponMessage.text}
              </p>
            )}
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>

    </div>
  );
}
