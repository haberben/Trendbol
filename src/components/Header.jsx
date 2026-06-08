import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, User, Heart, ShoppingCart, Mail, LogOut, CreditCard, ChevronDown, Package } from 'lucide-react';

export default function Header({ onSearch, activePage, setActivePage, setSelectedProduct }) {
  const { user, cart, favorites, inbox, logoutUser, virtualCard } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  
  const unreadEmails = inbox.filter(email => !email.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
      setActivePage('home'); // Go home to display search results
      setSelectedProduct(null); // Reset detail page
    }
  };

  const navigateTo = (page) => {
    setActivePage(page);
    setSelectedProduct(null);
    setShowAccountMenu(false);
  };

  return (
    <header className="header-wrapper">
      {/* Top Banner for Legal Notice & Fun Concept */}
      <div style={{
        backgroundColor: '#ff7300',
        color: 'white',
        fontSize: '11.5px',
        fontWeight: '600',
        padding: '6px 0',
        textAlign: 'center',
        letterSpacing: '0.5px'
      }}>
        🚀 Bu site yasal süreçlere uygun bir <strong>alışveriş simülatörüdür</strong>. Para harcanmaz! Trendbol Cüzdan limitleri tamamen bedavadır.
      </div>

      {/* Main Header Container */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        gap: '24px'
      }}>
        
        {/* Logo */}
        <div 
          onClick={() => navigateTo('home')} 
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start',
            userSelect: 'none'
          }}
        >
          <span style={{
            fontSize: '32px',
            fontWeight: '900',
            color: 'var(--brand)',
            letterSpacing: '-1.5px',
            lineHeight: 1
          }}>
            trendbol
          </span>
          <span style={{
            fontSize: '9px',
            fontWeight: '700',
            color: 'var(--text-sub)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginTop: '2px'
          }}>
            Dopamine Hub
          </span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ 
          flex: 1, 
          maxWidth: '540px', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Aradığınız ürün, kategori veya markayı yazınız..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 48px 12px 16px',
              borderRadius: '6px',
              border: '2px solid transparent',
              backgroundColor: '#f3f4f6',
              fontSize: '14px',
              transition: 'all 0.2s',
              color: '#333'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--brand)'}
            onBlur={(e) => e.target.style.borderColor = 'transparent'}
          />
          <button type="submit" style={{
            position: 'absolute',
            right: '12px',
            color: 'var(--brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Search size={20} />
          </button>
        </form>

        {/* Actions Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          
          {/* Account Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <div 
              onClick={() => navigateTo(user.isLoggedIn ? 'profile' : 'login')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: activePage === 'profile' || activePage === 'login' ? 'var(--brand)' : 'var(--text-main)',
                transition: 'var(--transition)',
                padding: '6px 0'
              }}
            >
              <User size={18} />
              <span className="hide-mobile">
                {user.isLoggedIn ? `Hesabım` : 'Giriş Yap'}
              </span>
              <ChevronDown size={14} className="hide-mobile" />
            </div>

            {/* Dropdown Card */}
            {showAccountMenu && (
              <div className="animate-fade-in" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                minWidth: '220px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 0',
                zIndex: 150
              }}>
                {user.isLoggedIn ? (
                  <>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', backgroundColor: '#fffbf7' }}>
                      <p style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</p>
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand)', fontSize: '12px', fontWeight: 'bold' }}>
                        <CreditCard size={14} />
                        <span>{virtualCard.limit.toLocaleString('tr-TR')} TL Limit</span>
                      </div>
                    </div>
                    
                    <button onClick={() => navigateTo('profile')} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '10px', padding: '10px 16px', color: 'var(--text-sub)', fontSize: '13.5px', textAlign: 'left' }}>
                      <CreditCard size={16} />
                      <span>Sanal Cüzdanım</span>
                    </button>
                    
                    <button onClick={() => navigateTo('orders')} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '10px', padding: '10px 16px', color: 'var(--text-sub)', fontSize: '13.5px', textAlign: 'left' }}>
                      <Package size={16} />
                      <span>Siparişlerim & Takip</span>
                    </button>

                    <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '4px 0' }} />

                    <button onClick={logoutUser} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '10px', padding: '10px 16px', color: 'var(--error)', fontSize: '13.5px', textAlign: 'left' }}>
                      <LogOut size={16} />
                      <span>Çıkış Yap</span>
                    </button>
                  </>
                ) : (
                  <div style={{ padding: '8px' }}>
                    <button 
                      onClick={() => navigateTo('login')} 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '10px 0', borderRadius: '6px' }}
                    >
                      Giriş Yap / Üye Ol
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Favorites */}
          <div 
            onClick={() => navigateTo('favorites')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: activePage === 'favorites' ? 'var(--brand)' : 'var(--text-main)',
              transition: 'var(--transition)',
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Heart size={18} />
              {favorites.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--error)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%'
                }} />
              )}
            </div>
            <span className="hide-mobile">Favorilerim</span>
          </div>

          {/* Cart */}
          <div 
            onClick={() => navigateTo('cart')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: activePage === 'cart' ? 'var(--brand)' : 'var(--text-main)',
              transition: 'var(--transition)'
            }}
          >
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  backgroundColor: 'var(--brand)',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: '700',
                  minWidth: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px'
                }}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </div>
            <span className="hide-mobile">Sepetim</span>
          </div>

          {/* In-app simulated Mailbox */}
          <div 
            onClick={() => navigateTo('inbox')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: activePage === 'inbox' ? 'var(--brand)' : 'var(--text-main)',
              transition: 'var(--transition)'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Mail size={18} />
              {unreadEmails > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  backgroundColor: 'var(--success)',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: '700',
                  minWidth: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px'
                }}>
                  {unreadEmails}
                </span>
              )}
            </div>
            <span className="hide-mobile">Gelen Kutusu</span>
          </div>

        </div>

      </div>

      {/* CSS overrides for responsive layout */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
