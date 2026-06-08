import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, ShieldAlert, Check } from 'lucide-react';

export default function Login({ setActivePage }) {
  const { registerUser } = useApp();
  const [activeTab, setActiveTab] = useState('register'); // 'login' or 'register'
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Register or login
    registerUser(name || 'Kullanıcı', email || 'kullanici@trendbol.com');
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setActivePage('home'); // Redirect home
    }, 1500);
  };

  const handleGuestBypass = () => {
    setActivePage('home'); // Just redirect home (guests are already initialized with a card)
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 16px', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{
        backgroundColor: 'white',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        padding: '32px 24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        
        {/* Brand name */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--brand)', letterSpacing: '-1px' }}>trendbol</h2>
          <p style={{ fontSize: '11.5px', color: 'var(--text-sub)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
            Dopamine Hub Giriş
          </p>
        </div>

        {/* Tab triggers */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('register')}
            style={{
              flex: 1,
              padding: '12px 0',
              fontWeight: '700',
              fontSize: '14px',
              color: activeTab === 'register' ? 'var(--brand)' : 'var(--text-muted)',
              borderBottom: '3px solid',
              borderColor: activeTab === 'register' ? 'var(--brand)' : 'transparent',
              marginBottom: '-2px',
              transition: 'var(--transition)'
            }}
          >
            Kayıt Ol (Limit Al)
          </button>
          <button
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: '12px 0',
              fontWeight: '700',
              fontSize: '14px',
              color: activeTab === 'login' ? 'var(--brand)' : 'var(--text-muted)',
              borderBottom: '3px solid',
              borderColor: activeTab === 'login' ? 'var(--brand)' : 'transparent',
              marginBottom: '-2px',
              transition: 'var(--transition)'
            }}
          >
            Giriş Yap
          </button>
        </div>

        {showSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }} className="animate-fade-in">
            <div style={{
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '2px solid var(--success)'
            }}>
              <Check size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Giriş Başarılı!</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>Sanal kartınız adınıza düzenlendi. Yönlendiriliyorsunuz...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {activeTab === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-sub)' }}>Ad Soyad</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Kartınızın üstünde görünecek isim"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', fontSize: '13px' }}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-sub)' }}>E-Posta Adresi</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', fontSize: '13px' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-sub)' }}>Şifre</label>
              <input
                type="password"
                placeholder="Şifreniz (Rastgele girebilirsiniz)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', fontSize: '13px' }}
                required
              />
            </div>

            {/* Safety warnings */}
            <div style={{ display: 'flex', gap: '8px', fontSize: '11.5px', color: 'var(--text-muted)', backgroundColor: 'var(--warning-light)', border: '1px solid #fde68a', padding: '10px', borderRadius: '6px', lineHeight: '1.4' }}>
              <ShieldAlert size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
              <span>
                Şifreler şifrelenmez veya dışarıya aktarılmaz. Tamamen yerel tarayıcı simülasyonu amaçlıdır.
              </span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px 0', borderRadius: '6px', fontSize: '14.5px', marginTop: '8px' }}
            >
              {activeTab === 'register' ? 'Üye Ol ve Sanal Kartı Al' : 'Giriş Yap'}
            </button>
            
            <div style={{ text: 'center', margin: '8px 0 4px 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              veya
            </div>
            
            <button 
              type="button" 
              onClick={handleGuestBypass}
              className="btn btn-outline" 
              style={{ width: '100%', padding: '12px 0', borderRadius: '6px', fontSize: '14.5px' }}
            >
              Misafir Olarak Devam Et
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
