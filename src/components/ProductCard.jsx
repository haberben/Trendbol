import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
  const { favorites, toggleFavorite, addToCart } = useApp();
  const isFav = favorites.some(item => item.id === product.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div 
      onClick={() => onSelect(product)}
      style={{
        backgroundColor: 'white',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'var(--transition)',
        boxShadow: 'var(--shadow-sm)'
      }}
      className="product-card-hover"
    >
      {/* Badges */}
      <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {product.bestSeller && (
          <span className="badge badge-orange" style={{ fontSize: '9px', padding: '2px 6px' }}>En Çok Satan</span>
        )}
        {product.flashSale && (
          <span className="badge badge-green" style={{ fontSize: '9px', padding: '2px 6px' }}>Flaş Ürün</span>
        )}
        {product.discountPercent > 0 && (
          <span className="badge badge-light-orange" style={{ fontSize: '10px', padding: '2px 6px', fontWeight: 'bold' }}>
            %{product.discountPercent} İndirim
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button 
        onClick={handleFavoriteClick}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 10,
          backgroundColor: 'white',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          color: isFav ? 'var(--error)' : 'var(--text-muted)',
          transition: 'var(--transition)'
        }}
      >
        <Heart size={16} fill={isFav ? 'var(--error)' : 'none'} />
      </button>

      {/* Product Image */}
      <div style={{ width: '100%', height: '220px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
        <img 
          src={product.images[0]} 
          alt={product.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          className="product-card-img"
        />
      </div>

      {/* Product Info */}
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Brand & Name */}
          <p style={{ fontSize: '13.5px', lineHeight: '1.4', marginBottom: '6px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            <strong style={{ color: 'var(--text-main)', marginRight: '4px' }}>{product.brand}</strong>
            <span style={{ color: 'var(--text-sub)' }}>{product.name.replace(product.brand, '').trim()}</span>
          </p>

          {/* Reviews Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', color: '#ffb800', fontWeight: '700', fontSize: '12px' }}>
              {product.rating} <Star size={12} fill="#ffb800" style={{ marginLeft: '2px' }} />
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              ({product.reviewCount.toLocaleString('tr-TR')})
            </span>
          </div>
        </div>

        <div>
          {/* Price Container */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '10px' }}>
            {product.discountPercent > 0 ? (
              <>
                <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--brand)' }}>
                  {product.discountPrice.toLocaleString('tr-TR')} TL
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {product.price.toLocaleString('tr-TR')} TL
                </span>
              </>
            ) : (
              <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                {product.price.toLocaleString('tr-TR')} TL
              </span>
            )}
          </div>

          {/* Quick Add To Cart */}
          <button 
            onClick={handleAddToCart}
            className="btn btn-outline"
            style={{ 
              width: '100%', 
              padding: '8px 0', 
              fontSize: '12.5px', 
              borderRadius: '6px', 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '6px',
              border: '1px solid var(--brand)',
              color: 'var(--brand)'
            }}
          >
            <ShoppingCart size={14} />
            Sepete Ekle
          </button>
        </div>
      </div>

      {/* Local hover effects */}
      <style>{`
        .product-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--brand);
        }
        .product-card-hover:hover .product-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
