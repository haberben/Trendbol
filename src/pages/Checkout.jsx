import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Check, CreditCard, Landmark, Truck, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

// Procedural cash register register sound using Web Audio API
const playSuccessSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Part 1: High metallic ding
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, audioCtx.currentTime); // B5
    osc1.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.08); // E6
    gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start();
    osc1.stop(audioCtx.currentTime + 0.35);

    // Part 2: Coin shaker noise (shhh clang)
    const bufferSize = audioCtx.sampleRate * 0.15;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.04, audioCtx.currentTime + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start(audioCtx.currentTime + 0.02);
    noise.stop(audioCtx.currentTime + 0.15);
  } catch (e) {
    console.warn('AudioContext not supported:', e);
  }
};

export default function Checkout({ setActivePage }) {
  const { cart, virtualCard, checkout, user } = useApp();

  const cartTotal = cart.reduce((total, item) => total + (item.product.discountPrice * item.quantity), 0);
  const shippingCost = cartTotal > 200 ? 0 : 39.99;
  const finalTotal = Math.floor(cartTotal + shippingCost);

  const [address, setAddress] = useState({
    fullName: user.name || '',
    phone: '0555 123 45 67',
    addressLine: 'Cumhuriyet Mahallesi, Atatürk Caddesi No:1923 Kat:3 D:6',
    city: 'İstanbul',
    district: 'Kadıköy'
  });

  const [paymentStep, setPaymentStep] = useState(false); // false: address, true: card payment
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [successOrderNo, setSuccessOrderNo] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!address.fullName.trim() || !address.phone.trim() || !address.addressLine.trim() || !address.city.trim() || !address.district.trim()) {
      alert('Lütfen adres formundaki tüm alanları doldurunuz.');
      return;
    }
    setPaymentStep(true);
  };

  const handleConfirmPayment = () => {
    const res = checkout(address);
    if (res.success) {
      setSuccessOrderNo(res.orderId);
      
      // Play Cash Register chime
      playSuccessSound();
      
      // Play Confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      
      setIsSuccessModal(true);
    } else {
      alert(res.reason);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 16px', paddingBottom: '80px' }}>
      
      <button 
        onClick={() => paymentStep ? setPaymentStep(false) : setActivePage('cart')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-sub)', fontSize: '14px', fontWeight: '600', marginBottom: '20px', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} />
        {paymentStep ? 'Adres Bilgilerine Dön' : 'Sepetime Dön'}
      </button>

      <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>
        {paymentStep ? 'Ödeme Sayfası' : 'Teslimat & Adres Bilgileri'}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '24px',
        alignItems: 'start'
      }}
      className="checkout-grid-responsive"
      >
        
        {/* Left Side: Forms */}
        <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          {!paymentStep ? (
            /* Address input screen */
            <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-sub)' }}>Ad Soyad</label>
                  <input
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', fontSize: '13px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-sub)' }}>Telefon Numarası</label>
                  <input
                    type="text"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', fontSize: '13px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-sub)' }}>İl</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', fontSize: '13px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-sub)' }}>İlçe</label>
                  <input
                    type="text"
                    name="district"
                    value={address.district}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', fontSize: '13px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-sub)' }}>Adres Satırı</label>
                <textarea
                  name="addressLine"
                  value={address.addressLine}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', height: '80px', resize: 'none' }}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ alignSelf: 'flex-end', padding: '12px 28px', fontSize: '14px', borderRadius: '6px' }}
              >
                Ödeme Adımına Geç
              </button>
            </form>
          ) : (
            /* Card payment screen */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={18} style={{ color: 'var(--brand)' }} />
                  Ödeme Yöntemi: Trendbol Sanal Kart
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-sub)', lineHeight: '1.5', marginBottom: '16px' }}>
                  Limitleriniz tamamen simülatör tarafından hediye edilmiştir. Gerçek kart bilgilerinizi girmenize gerek yoktur.
                </p>

                {/* Simulated Glassmorphic Credit Card display */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '320px',
                    height: '180px',
                    background: 'linear-gradient(135deg, #ff8c00 0%, #ff5500 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(255, 85, 0, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800' }}>
                      <span>trendbol cüzdan</span>
                      <span>VISA</span>
                    </div>
                    <div style={{ fontSize: '16px', letterSpacing: '2px', wordSpacing: '4px', fontFamily: 'monospace' }}>
                      {virtualCard.cardNumber}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                      <div>
                        <span style={{ fontSize: '8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Kart Sahibi</span>
                        <div>{virtualCard.cardHolder}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Limit</span>
                        <div>{virtualCard.limit.toLocaleString('tr-TR')} TL</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'var(--success-light)',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '12px',
                color: 'var(--success)',
                fontSize: '13px'
              }}>
                <ShieldCheck size={20} />
                <span>
                  <strong>Güvenli Simülasyon:</strong> Kart bilgileri kaydedilmez ve hiçbir veri dışarıya aktarılmaz.
                </span>
              </div>

              <button 
                onClick={handleConfirmPayment}
                className="btn btn-success"
                style={{ width: '100%', padding: '14px 0', borderRadius: '8px', fontSize: '15px' }}
              >
                Siparişi Tamamla & Öde ({finalTotal.toLocaleString('tr-TR')} TL)
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Order summary checklist */}
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-sub)' }}>
              <span>Sepet Toplamı:</span>
              <span>{cartTotal.toLocaleString('tr-TR')} TL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-sub)' }}>
              <span>Kargo Ücreti:</span>
              <span>{shippingCost === 0 ? 'Bedava' : `${shippingCost} TL`}</span>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#111' }}>
              <span>Toplam:</span>
              <span style={{ color: 'var(--brand)' }}>{finalTotal.toLocaleString('tr-TR')} TL</span>
            </div>
          </div>

          <div style={{ border: '1px dashed var(--border)', borderRadius: '6px', padding: '10px', backgroundColor: '#fafafa', fontSize: '12px', color: 'var(--text-sub)' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Truck size={14} style={{ color: 'var(--brand)' }} />
              Trendbol Express Kargo
            </div>
            Paketleriniz özel Trendbol Express kargo kuryelerimizle en hızlı şekilde kapınızda olacaktır.
          </div>
        </div>

      </div>

      {/* Checkout Success Modal */}
      {isSuccessModal && (
        <div className="overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '420px', padding: '32px 24px', textAlign: 'center' }}>
            
            <div style={{
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              border: '2px solid var(--success)'
            }}>
              <Check size={36} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#111' }}>
              Siparişiniz Alındı! 🎉
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-sub)', lineHeight: '1.5', marginBottom: '16px' }}>
              Sipariş numaranız: <strong>{successOrderNo}</strong>.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
              Girdiğiniz adrese kargo takip detayları içeren fake bir e-posta gönderildi! Posta kutunuzu hemen kontrol edebilirsiniz.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => { setIsSuccessModal(false); setActivePage('orders'); }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 0' }}
              >
                Siparişlerimi Takip Et
              </button>
              <button 
                onClick={() => { setIsSuccessModal(false); setActivePage('inbox'); }}
                className="btn btn-outline"
                style={{ width: '100%', padding: '12px 0' }}
              >
                Posta Kutuma Git
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Embedded CSS overrides */}
      <style>{`
        @media (max-width: 768px) {
          .checkout-grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>

    </div>
  );
}
