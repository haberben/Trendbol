import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import AdSimulator from './components/AdSimulator';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Inbox from './pages/Inbox';
import Login from './pages/Login';
import OrderTracking from './pages/OrderTracking';

import { Shield, Sparkles, Heart } from 'lucide-react';

function MainApp() {
  const { favorites } = useApp();
  
  const [activePage, setActivePage] = useState('home'); // home, detail, cart, checkout, profile, inbox, login, orders, favorites
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setActivePage('detail');
  };

  const handleBackToHome = () => {
    setActivePage('home');
    setSelectedProduct(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Sticky Header */}
      <Header 
        onSearch={(query) => {
          setSearchQuery(query);
          setSelectedCategory('all');
        }}
        activePage={activePage}
        setActivePage={setActivePage}
        setSelectedProduct={setSelectedProduct}
      />

      {/* Main Pages Router */}
      <main style={{ flex: 1, backgroundColor: 'var(--bg-sub)' }}>
        {(() => {
          switch (activePage) {
            case 'home':
              return (
                <Home 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onSelectProduct={handleProductSelect}
                  setActivePage={setActivePage}
                />
              );
            case 'detail':
              return (
                <ProductDetail 
                  product={selectedProduct}
                  onBack={handleBackToHome}
                  setActivePage={setActivePage}
                />
              );
            case 'cart':
              return (
                <Cart 
                  setActivePage={setActivePage}
                  setSelectedProduct={setSelectedProduct}
                />
              );
            case 'checkout':
              return (
                <Checkout 
                  setActivePage={setActivePage}
                />
              );
            case 'profile':
              return (
                <Profile />
              );
            case 'inbox':
              return (
                <Inbox />
              );
            case 'login':
              return (
                <Login 
                  setActivePage={setActivePage}
                />
              );
            case 'orders':
              return (
                <OrderTracking />
              );
            case 'favorites':
              return (
                <div className="container animate-fade-in" style={{ padding: '24px 16px', paddingBottom: '80px' }}>
                  <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={24} style={{ color: 'var(--error)' }} />
                    <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Favorilerim ({favorites.length} Ürün)</h2>
                  </div>

                  {favorites.length === 0 ? (
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '60px 16px',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-sm)',
                      maxWidth: '500px',
                      margin: '0 auto'
                    }}>
                      <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Favori Listeniz Boş</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                        Beğendiğiniz ürünlerin üzerindeki kalp simgesine tıklayarak favori listenizi doldurabilirsiniz.
                      </p>
                      <button 
                        onClick={() => setActivePage('home')}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        Alışverişe Başla
                      </button>
                    </div>
                  ) : (
                    <div className="grid-products">
                      {favorites.map((product) => (
                        <div key={product.id} onClick={() => handleProductSelect(product)}>
                          {/* Reuse ProductCard logic manually or import ProductCard. 
                              Let's render a custom light wrapper or the Home ProductCard. */}
                          <div style={{
                            backgroundColor: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                          }}>
                            <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            <div style={{ padding: '12px' }}>
                              <p style={{ fontSize: '13px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <span style={{ color: 'var(--brand)', marginRight: '4px' }}>{product.brand}</span>
                                {product.name.replace(product.brand, '').trim()}
                              </p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--brand)' }}>
                                  {product.discountPrice.toLocaleString('tr-TR')} TL
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            default:
              return <div className="container" style={{ padding: '40px 0' }}>Sayfa Bulunamadı</div>;
          }
        })()}
      </main>

      {/* Global Ad Simulator Modal */}
      <AdSimulator />

      {/* Footer (Legal Safety & Warnings Disclaimer) */}
      <footer style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '36px 0 24px 0',
        borderTop: '5px solid var(--brand)',
        fontSize: '13px'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.2fr 1fr 1fr', 
            gap: '30px',
            marginBottom: '30px'
          }}
          className="footer-grid-responsive"
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--brand)', marginBottom: '8px' }}>trendbol</h3>
              <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '12px' }}>
                Trendbol, Türkiye'nin popüler e-ticaret sitelerinden esinlenerek oluşturulmuş tamamen 
                <strong> simülatif</strong> bir sanal alışveriş platformudur.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '11px', marginTop: '12px', border: '1px solid #d97706', padding: '8px 12px', borderRadius: '6px' }}>
                <Shield size={16} style={{ flexShrink: 0 }} />
                <span>Yasal Uyarı: Bu sitede yapılan hiçbir işlem gerçek değildir, gerçek para harcanmaz ve kredi kartı girilmez.</span>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#f3f4f6' }}>Simülasyon Özellikleri</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: '#9ca3af', fontSize: '12px' }}>
                <li>• Rastgele Limitli Sanal Cüzdan</li>
                <li>• Reklam İzleyerek Sanal Limit Boostlama</li>
                <li>• 1000+ Popüler E-Ticaret Ürünü</li>
                <li>• İnteraktif Gelen Kutusu & fake Fişler</li>
                <li>• cargo Aşamalarını Reklamla Hızlandırma</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#f3f4f6' }}>Dopamin Detoksu</h4>
              <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '12px' }}>
                Amacımız, tüketim çılgınlığı ve gereksiz harcama alışkanlıkları olan kişilerin alışveriş yapma isteğini (sepet doldurma, onaylama, kargo bekleme, mail alma gibi dopamin döngülerini) tamamen sanal ortamda simüle ederek engellemeye yardımcı olmaktır.
              </p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #374151', margin: '20px 0' }} />

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            color: '#9ca3af',
            fontSize: '11.5px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <span>© 2026 Trendbol Alışveriş Simülatörü. Tüm Hakları Saklıdır.</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Made for dopamine wellness
              <Sparkles size={12} style={{ color: 'var(--brand)' }} />
            </span>
          </div>

        </div>
      </footer>

      {/* Footer responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .footer-grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
