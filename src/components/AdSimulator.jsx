import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Volume2, VolumeX, ShieldAlert, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

// Procedural sound generator using Web Audio API
const playRewardSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // First chime (mid tone)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start();
    osc1.stop(audioCtx.currentTime + 0.3);

    // Second chime (higher tone, slightly delayed)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.1); // G5
    gain2.gain.setValueAtTime(0.08, audioCtx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start();
    osc2.stop(audioCtx.currentTime + 0.5);

    // Final win fanfare (extra high, delayed)
    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.2); // C6
    gain3.gain.setValueAtTime(0.05, audioCtx.currentTime + 0.2);
    gain3.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
    osc3.connect(gain3);
    gain3.connect(audioCtx.destination);
    osc3.start();
    osc3.stop(audioCtx.currentTime + 0.6);

  } catch (e) {
    console.warn('AudioContext not supported or blocked by browser policy:', e);
  }
};

const mockAds = [
  {
    title: 'Trendbol Cüzdanım - Harcadıkça Kazandıran Simülasyon!',
    description: 'Sıfır risk, maksimum keyif! Trendbol Cüzdan ile gerçek cüzdanınızı dinlendirin, sanal alışveriş çılgınlığının tadını çıkarın.',
    tagline: 'Cüzdan limitleri tamamen bedava!',
    cta: 'Daha Fazla Limit Kazan',
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
  },
  {
    title: 'Rise of Trendbol: Mobil İmparatorluk',
    description: 'Kendi mağazanı kur, popüler ürünleri listele, milyonlarca sanal müşteriye satış yap! En büyük Trendbol satıcısı sen ol.',
    tagline: 'Strateji ve E-Ticaret Bir Arada!',
    cta: 'Hemen Oyna (Sanal)',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
  },
  {
    title: 'Dopamine GO! - Alışveriş Detoksu Asistanı',
    description: 'Alışveriş sepetinizi doldururken paranız cebinizde kalsın. Tüketim çılgınlığını yenmek için simülatörlerimizi kullanın.',
    tagline: 'Cebinizdeki Dost Simülatör',
    cta: 'Keşfet',
    gradient: 'linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)'
  }
];

export default function AdSimulator() {
  const { activeAd, closeAd } = useApp();
  
  if (!activeAd) return null;

  const duration = activeAd.type === 'limit' ? 15 : 10; // 15s for limit boost, 10s for cargo speed up
  const [timeLeft, setTimeLeft] = useState(duration);
  const [adFinished, setAdFinished] = useState(false);
  const [muted, setMuted] = useState(false);
  
  // Pick an ad based on date/time or randomly
  const adRef = useRef(mockAds[Math.floor(Math.random() * mockAds.length)]);
  const currentAd = adRef.current;

  useEffect(() => {
    setTimeLeft(duration);
    setAdFinished(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAd, duration]);

  const handleClaim = () => {
    if (!adFinished) return;
    
    // Play celebratory effects
    if (!muted) {
      playRewardSound();
    }
    
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff7300', '#22c55e', '#3b82f6', '#f59e0b']
    });

    // Invoke state callbacks
    activeAd.callback();
    closeAd();
  };

  const percentComplete = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '460px', height: '560px' }}>
        
        {/* Ad Header */}
        <div className="modal-header" style={{ backgroundColor: '#111', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Sponsorlu
            </span>
            <span style={{ fontSize: '13px', color: '#ccc' }}>
              {adFinished ? 'Reklam Tamamlandı' : `Ödüle Kalan: ${timeLeft} sn`}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setMuted(!muted)} style={{ color: '#aaa' }}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            {adFinished ? (
              <button onClick={closeAd} className="close-btn" style={{ color: '#aaa' }}>
                <X size={20} />
              </button>
            ) : (
              <span style={{ color: '#555', cursor: 'not-allowed' }} title="Reklam bitene kadar kapatılamaz">
                <X size={20} />
              </span>
            )}
          </div>
        </div>

        {/* Ad Creative Area */}
        <div style={{ 
          flex: 1, 
          background: currentAd.gradient, 
          color: 'white', 
          padding: '36px 24px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
              {currentAd.title}
            </h1>
            <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.6', marginBottom: '20px' }}>
              {currentAd.description}
            </p>
            <span style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' }}>
              {currentAd.tagline}
            </span>
          </div>

          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{
              backgroundColor: 'white',
              color: '#111',
              padding: '12px 24px',
              borderRadius: '99px',
              fontWeight: '700',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}>
              <Sparkles size={16} style={{ color: '#ff7300' }} />
              {currentAd.cta}
            </div>
          </div>

          {/* Background Decorative Circles */}
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            pointerEvents: 'none'
          }}></div>
        </div>

        {/* Progress Bar & Reward Action */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          
          {/* Progress gauge */}
          {!adFinished ? (
            <div>
              <div style={{ height: '6px', width: '100%', backgroundColor: '#eee', borderRadius: '99px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${percentComplete}%`, 
                  backgroundColor: 'var(--brand)', 
                  transition: 'width 1s linear'
                }}></div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
                Limit ödülünü kazanmak için lütfen reklamı sonuna kadar izleyin...
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{ 
                  backgroundColor: 'var(--success-light)', 
                  color: 'var(--success)', 
                  width: '54px', 
                  height: '54px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(34, 197, 94, 0.15)'
                }}>
                  <Award size={28} />
                </div>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Tebrikler! Ödülün Hazır</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '18px' }}>
                {activeAd.type === 'limit' 
                  ? `Kart limitine +${activeAd.rewardAmount} TL eklemek için butona tıkla.`
                  : 'Kargo teslimatını bir sonraki aşamaya hızlandırmak için butona tıkla.'}
              </p>
              <button 
                onClick={handleClaim} 
                className="btn btn-success" 
                style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '15px' }}
              >
                {activeAd.type === 'limit' ? `+${activeAd.rewardAmount} TL Limiti Yükle` : 'Kargoyu Hızlandır'}
              </button>
            </div>
          )}

          {/* Legal simulated warnings */}
          <div style={{ display: 'flex', alignItems: 'center', justify: 'center', gap: '6px', marginTop: '16px', color: 'var(--text-muted)', fontSize: '10px' }}>
            <ShieldAlert size={12} />
            <span>Bu reklam simülasyondur. Gerçek finansal kazanç veya ödeme sağlamaz.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
