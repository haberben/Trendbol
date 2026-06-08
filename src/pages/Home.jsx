import React, { useState, useEffect, useMemo } from 'react';
import productsData from '../data/products.json';
import ProductCard from '../components/ProductCard';
import CategoryNav from '../components/CategoryNav';
import { CreditCard, Sparkles, Flame, Percent, ArrowRight, Filter, ChevronRight } from 'lucide-react';
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
    subtitle: '2080 popüler ürünle sanal kombinlerinizi yapın.'
  }
];

const filterBrands = ['Mavi', 'Apple', 'Dyson', 'Xiaomi', 'Nike', 'L\'Oreal Paris', 'Karaca', 'Prima', 'Defacto', 'Samsung'];

export default function Home({ searchQuery, setSearchQuery, selectedCategory, onSelectCategory, onSelectProduct, setActivePage }) {
  const { virtualCard, triggerLimitBoostAd } = useApp();
  const [currentBanner, setCurrentBanner] = useState(0);

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all'); // all, 0-500, 500-2000, 2000-10000, 10000+

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Reset filter selections when category or search changes
  useEffect(() => {
    setSelectedBrands([]);
    setSelectedPriceRange('all');
  }, [selectedCategory, searchQuery]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Perform filtration utilizing memoization for high performance
  const filteredProducts = useMemo(() => {
    return productsData.filter((prod) => {
      // Category match
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      
      // Search query match
      const matchesSearch = !searchQuery || 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Brands match
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(prod.brand);

      // Price range match
      let matchesPrice = true;
      const price = prod.discountPrice;
      if (selectedPriceRange === '0-500') matchesPrice = price <= 500;
      else if (selectedPriceRange === '500-2000') matchesPrice = price > 500 && price <= 2000;
      else if (selectedPriceRange === '2000-10000') matchesPrice = price > 2000 && price <= 10000;
      else if (selectedPriceRange === '10000+') matchesPrice = price > 10000;

      return matchesCategory && matchesSearch && matchesBrand && matchesPrice;
    });
  }, [selectedCategory, searchQuery, selectedBrands, selectedPriceRange]);

  // Split widgets
  const flashSales = useMemo(() => {
    return filteredProducts.filter(p => p.flashSale).slice(0, 4);
  }, [filteredProducts]);

  const regularProducts = useMemo(() => {
    return filteredProducts.slice(0, 36);
  }, [filteredProducts]);

  return (
    <div style={{ paddingBottom: '60px' }}>
      
      {/* Category Navigation Bar */}
      <CategoryNav 
        selectedCategory={selectedCategory} 
        onSelectCategory={(cat) => {
          onSelectCategory(cat);
          setSearchQuery('');
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

          {/* Dots Indicator */}
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

      {/* Wallet Balance alert banner */}
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
                Sanal Cüzdan Limitiniz: <span style={{ color: 'var(--brand)' }}>{virtualCard.limit.toLocaleString('tr-TR')} TL</span>
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                Gerçek para harcamadan dilediğiniz gibi alışveriş yapın. Limit biterse reklamlara tıklayarak yükleyin!
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => triggerLimitBoostAd()}
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '6px' }}
          >
            <Sparkles size={14} />
            Limit Artır (+2500 TL)
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Catalog */}
      <div className="container" style={{ marginTop: '30px' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '24px',
          alignItems: 'start'
        }}
        className="home-layout-grid"
        >
          
          {/* Left Sidebar Filters Panel (Desktop Only) */}
          <aside className="filter-sidebar" style={{
            backgroundColor: 'white',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'sticky',
            top: '120px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '4px' }}>
              <Filter size={16} style={{ color: 'var(--brand)' }} />
              <h4 style={{ fontSize: '14px', fontWeight: '800' }}>Filtreler</h4>
            </div>

            {/* Categories Selection List */}
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>Kategoriler</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['all', 'kadin', 'erkek', 'elektronik', 'kozmetik', 'ev-yasam', 'supermarket', 'anne-bebek'].map(catId => (
                  <button
                    key={catId}
                    onClick={() => {
                      onSelectCategory(catId);
                      setSearchQuery('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12.5px',
                      color: selectedCategory === catId ? 'var(--brand)' : 'var(--text-sub)',
                      fontWeight: selectedCategory === catId ? '700' : 'normal',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    <span>{catId === 'all' ? 'Tüm Ürünler' : catId.charAt(0).toUpperCase() + catId.slice(1).replace('-', ' & ')}</span>
                    <ChevronRight size={12} style={{ opacity: selectedCategory === catId ? 1 : 0.3 }} />
                  </button>
                ))}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

            {/* Brands checklist */}
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>Markalar</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                {filterBrands.map(brand => (
                  <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-sub)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      style={{ accentColor: 'var(--brand)' }}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

            {/* Price Ranges selection */}
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>Fiyat Aralığı</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { key: 'all', label: 'Tümü' },
                  { key: '0-500', label: '0 - 500 TL' },
                  { key: '500-2000', label: '500 - 2.000 TL' },
                  { key: '2000-10000', label: '2.000 - 10.000 TL' },
                  { key: '10000+', label: '10.000 TL ve üzeri' }
                ].map(range => (
                  <label key={range.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-sub)', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceRange === range.key}
                      onChange={() => setSelectedPriceRange(range.key)}
                      style={{ accentColor: 'var(--brand)' }}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Panel: Products View */}
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
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
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Filtrelerinize uygun ürün bulunamadı.</p>
                <button 
                  onClick={() => { setSearchQuery(''); onSelectCategory('all'); setSelectedBrands([]); setSelectedPriceRange('all'); }} 
                  className="btn btn-secondary" 
                  style={{ marginTop: '16px' }}
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <>
                {/* Flash Sales Section */}
                {flashSales.length > 0 && !searchQuery && selectedBrands.length === 0 && selectedPriceRange === 'all' && (
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <Flame size={20} style={{ color: 'var(--error)' }} />
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#111' }}>Günün Flaş Fırsatları</h4>
                      <span style={{ fontSize: '11px', backgroundColor: 'var(--error-light)', color: 'var(--error)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                        Flaş İndirimler
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

                {/* Regular Products Grid */}
                <div className="grid-products">
                  {regularProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={onSelectProduct}
                    />
                  ))}
                </div>
                
                {filteredProducts.length > 36 && (
                  <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      Toplam {filteredProducts.length} üründen 36 tanesi gösteriliyor.
                    </p>
                    <button 
                      onClick={() => alert('Daha fazla ürün için yukarıdaki filtreleri veya arama çubuğunu kullanabilirsiniz!')}
                      className="btn btn-outline"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      Daha Fazla Sonuç
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>

      {/* Responsive overrides via inline style injection (handles desktop grid hides) */}
      <style>{`
        @media (max-width: 768px) {
          .home-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .filter-sidebar {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
