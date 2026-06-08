import React, { useState, useEffect } from 'react';
import productsData from '../data/products.json';
import ProductCard from '../components/ProductCard';
import CategoryNav from '../components/CategoryNav';
import { CreditCard, Sparkles, Flame, Percent, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const bannerImages = [
  {
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&h=450&q=80',
    title: 'Büyük Trendbol Ekim Fırsatları',
    subtitle: 'Sanal Limitlerinizle Sepeti Doldurun, Dopamini Yakalayın!'
  },
  {
    url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&h=450&q=80',
    title: 'Efsane Teknoloji Günleri',
    subtitle: 'Sanal Kart limiti ile son model telefonlar ve robot süpürgeler sizi bekliyor.'
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=450&q=80',
    title: 'Trendbol Giyim & Kozmetik Şöleni',
    subtitle: '1000\'den fazla popüler ürünle sanal kombinlerinizi yapın.'
  }
];

export default function Home({ searchQuery, setSearchQuery, selectedCategory, onSelectCategory, onSelectProduct, setActivePage }) {
  const { virtualCard, triggerLimitBoostAd } = useApp();
  const [currentBanner, setCurrentBanner] = useState(0);

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter products based on search query and category
  const filteredProducts = productsData.filter((prod) => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Split filtered products for widget displays
  const flashSales = filteredProducts.filter(p => p.flashSale).slice(0, 4);
  const bestSellers = filteredProducts.filter(p => p.bestSeller).slice(0, 8);
  const regularProducts = filteredProducts.slice(0, 36); // Display up to 36 products initially for performance

  return (
    <div style={{ paddingBottom: '60px' }}>
      
      {/* Category Navigation Subheader */}
      <CategoryNav 
        selectedCategory={selectedCategory} 
        onSelectCategory={(cat) => {
          onSelectCategory(cat);
          setSearchQuery(''); // Reset search when clicking category
        }} 
      />

      {/* Hero Banner Carousel */}
      <div className="container" style={{ marginTop: '16px' }}>
        <div style={{
          width: '100%',
          height: '320px',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'var(--shadow-md)'
        }}>
          {bannerImages.map((banner, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url(${banner.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: currentBanner === index ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '40px 32px',
                color: 'white',
                pointerEvents: currentBanner === index ? 'auto' : 'none'
              }}
            >
              <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {banner.title}
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.9, fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {banner.subtitle}
              </p>
            </div>
          ))}

          {/* Banner Dots Indicators */}
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: currentBanner === index ? 'var(--brand)' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Wallet Float Alert (Dopamine Trigger) */}
      <div className="container" style={{ marginTop: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #fed7aa',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand)', padding: '10px', borderRadius: '50%' }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                Trendbol Sanal Limitiniz: <span style={{ color: 'var(--brand)' }}>{virtualCard.limit.toLocaleString('tr-TR')} TL</span>
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                Limitiniz mi azaldı? Hiç sorun değil! Tek kuruş ödemeden limiti anında katlayabilirsiniz.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => triggerLimitBoostAd()}
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '6px' }}
          >
            <Sparkles size={14} />
            Hemen Limit Artır (+2500 TL)
          </button>
        </div>
      </div>

      {/* Search status / Category title */}
      <div className="container" style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
          {searchQuery ? `"${searchQuery}" için Arama Sonuçları (${filteredProducts.length} ürün)` : 'Sizin İçin Seçtiğimiz Ürünler'}
        </h3>

        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid var(--border)'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Aradığınız kriterlere uygun ürün bulunamadı.</p>
            <button 
              onClick={() => { setSearchQuery(''); onSelectCategory('all'); }} 
              className="btn btn-secondary" 
              style={{ marginTop: '16px' }}
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <>
            {/* Flash Sales Widget (if we have flash sale items and no active text search) */}
            {flashSales.length > 0 && !searchQuery && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Flame size={20} style={{ color: 'var(--error)' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#111' }}>Günün Flaş Fırsatları</h4>
                  <span style={{ fontSize: '11px', backgroundColor: 'var(--error-light)', color: 'var(--error)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                    Sınırlı Süre
                  </span>
                </div>
                
                <div className="grid-products">
                  {flashSales.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onSelect={onSelectProduct} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Products Grid */}
            <div className="grid-products">
              {regularProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
            
            {/* Show More Trigger (Simulated for high performance) */}
            {filteredProducts.length > 36 && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Toplam {filteredProducts.length} üründen 36 tanesi gösteriliyor.
                </p>
                <button 
                  onClick={() => alert('Trendbol simülasyonunda 1000+ ürünün hepsi listelenmiştir, arama çubuğunu kullanarak spesifik aramalar yapabilirsiniz!')}
                  className="btn btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Daha Fazla Ürün Göster
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
