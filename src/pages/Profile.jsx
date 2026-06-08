import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import VirtualCard from '../components/VirtualCard';
import { User, Mail, Save, HelpCircle, Film, Sparkles, Award } from 'lucide-react';

export default function Profile() {
  const { user, registerUser, virtualCard, triggerLimitBoostAd } = useApp();
  
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    registerUser(profileName, profileEmail);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleBoost = () => {
    triggerLimitBoostAd();
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 16px', paddingBottom: '80px' }}>
      
      <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>Sanal Cüzdanım & Profilim</h2>

      {/* Grid Layout: Card dashboard vs Settings */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: '30px',
        alignItems: 'start'
      }}
      className="profile-grid-responsive"
      >
        
        {/* Left Side: Virtual Card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <VirtualCard />
          
          {/* Simulated Info Box */}
          <div style={{
            marginTop: '20px',
            backgroundColor: '#fffaf5',
            border: '1px solid #ffe0cc',
            borderRadius: '10px',
            padding: '16px',
            fontSize: '12.5px',
            color: 'var(--text-sub)',
            lineHeight: '1.6',
            width: '100%',
            maxWidth: '380px'
          }}>
            <h4 style={{ fontWeight: '700', color: 'var(--brand)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <HelpCircle size={15} />
              Sanal Limit Nedir?
            </h4>
            <p>
              Trendbol, alışveriş çılgınlığınızı tatmin ederken cüzdanınızı korumak için tasarlanmış bir simülatördür. 
              Kartınızdaki limitler tamamen ücretsizdir. Daha fazla limit elde etmek için reklamlara tıklayabilirsiniz!
            </p>
          </div>
        </div>

        {/* Right Side: Profile Edit & Limit Boosters list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Profile Details Edit Form */}
          <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Üyelik Bilgileri
            </h3>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-responsive">
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-sub)' }}>
                    Adınız Soyadınız (Kart Üzerinde Gözükecek)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', fontSize: '13px' }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-sub)' }}>
                    E-Posta Adresiniz (Fake Fişlerin Gideceği Adres)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', fontSize: '13px' }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                {saveSuccess ? (
                  <p style={{ color: 'var(--success)', fontSize: '13px', fontWeight: 'bold' }}>
                    Bilgileriniz başarıyla güncellendi! Kart sahibiniz revize edildi.
                  </p>
                ) : <span />}
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px', borderRadius: '6px' }}
                >
                  <Save size={16} />
                  Güncelle
                </button>
              </div>
            </form>
          </div>

          {/* Gamified Advertisement Boosters list */}
          <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>
              Limit Artırma Görevleri
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '20px' }}>
              Simülatör cüzdanınızı doldurmak için dilediğiniz görevi seçip reklamı izleyebilirsiniz.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Task 1 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#fcfcfd'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand)', padding: '10px', borderRadius: '8px' }}>
                    <Film size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13.5px', fontWeight: '700' }}>Kısa Sponsorlu Gösterim</h4>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>10 Saniye reklam izleyerek limit ekleyin.</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleBoost}
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '12.5px', borderRadius: '6px' }}
                >
                  <Sparkles size={12} />
                  +1.500 TL Limit
                </button>
              </div>

              {/* Task 2 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#fcfcfd'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', padding: '10px', borderRadius: '8px' }}>
                    <Film size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13.5px', fontWeight: '700' }}>Orta Boy Sponsorlu Gösterim</h4>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>15 Saniye reklam izleyerek limit ekleyin.</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleBoost}
                  className="btn btn-outline"
                  style={{ padding: '8px 14px', fontSize: '12.5px', borderRadius: '6px', borderColor: 'var(--success)', color: 'var(--success)' }}
                >
                  <Sparkles size={12} />
                  +3.000 TL Limit
                </button>
              </div>

              {/* Task 3 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '10px', borderRadius: '8px' }}>
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13.5px', fontWeight: '700', color: '#b45309' }}>Mega Ödüllü Gösterim 👑</h4>
                    <p style={{ fontSize: '11.5px', color: '#d97706' }}>15 Saniye reklam izleyerek devasa limit ekleyin.</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleBoost}
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '12.5px', borderRadius: '6px', backgroundColor: '#d97706' }}
                >
                  <Sparkles size={12} />
                  +5.000 TL Limit
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .form-row-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
