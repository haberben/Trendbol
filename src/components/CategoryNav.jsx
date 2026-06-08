import React from 'react';

const categories = [
  { id: 'kadin', name: 'Kadın Giyim', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=150&q=80' },
  { id: 'erkek', name: 'Erkek Giyim', img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=150&q=80' },
  { id: 'ayakkabi-canta', name: 'Ayakkabı & Çanta', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150&q=80' },
  { id: 'kozmetik', name: 'Kozmetik', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80' },
  { id: 'elektronik', name: 'Elektronik', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&q=80' },
  { id: 'ev-yasam', name: 'Ev & Yaşam', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=150&q=80' },
  { id: 'supermarket', name: 'Süpermarket', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80' },
  { id: 'anne-bebek', name: 'Anne & Bebek', img: 'https://images.unsplash.com/photo-1519689680058-324335c77ebf?auto=format&fit=crop&w=150&q=80' }
];

export default function CategoryNav({ selectedCategory, onSelectCategory }) {
  return (
    <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border)', padding: '4px 0 0 0' }}>
      
      {/* Horizontal Bar Category Links */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'auto',
        gap: '24px',
        scrollbarWidth: 'none',
        paddingBottom: '2px'
      }}>
        <button
          onClick={() => onSelectCategory('all')}
          style={{
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: '700',
            color: selectedCategory === 'all' ? 'var(--brand)' : 'var(--text-main)',
            borderBottom: '2px solid',
            borderColor: selectedCategory === 'all' ? 'var(--brand)' : 'transparent',
            whiteSpace: 'nowrap',
            transition: 'var(--transition)'
          }}
        >
          Tüm Ürünler
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              padding: '10px 4px',
              fontSize: '13px',
              fontWeight: '700',
              color: selectedCategory === cat.id ? 'var(--brand)' : 'var(--text-main)',
              borderBottom: '2px solid',
              borderColor: selectedCategory === cat.id ? 'var(--brand)' : 'transparent',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Circular Category Bubbles for visuals */}
      <div className="container">
        <div className="category-bubbles">
          <div 
            onClick={() => onSelectCategory('all')} 
            className="category-bubble-item"
          >
            <div className="category-bubble-image" style={{ borderColor: selectedCategory === 'all' ? 'var(--brand)' : 'transparent' }}>
              <div style={{
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand)',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '20px'
              }}>
                %
              </div>
            </div>
            <span className="category-bubble-text">Fırsatlar</span>
          </div>

          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => onSelectCategory(cat.id)} 
              className="category-bubble-item"
            >
              <div className="category-bubble-image" style={{ borderColor: selectedCategory === cat.id ? 'var(--brand)' : 'transparent' }}>
                <img src={cat.img} alt={cat.name} />
              </div>
              <span className="category-bubble-text">{cat.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
