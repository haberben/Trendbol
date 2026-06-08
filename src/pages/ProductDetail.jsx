import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, Heart, ShoppingCart, ShieldAlert, Sparkles, Check, Send } from 'lucide-react';

export default function ProductDetail({ product, onBack, setActivePage }) {
  const { cart, favorites, virtualCard, toggleFavorite, addToCart, triggerLimitBoostAd } = useApp();
  
  const [selectedSize, setSelectedSize] = useState(() => {
    // If fashion product, default size to M
    if (product.category === 'kadin' || product.category === 'erkek') {
      return 'M';
    }
    return null;
  });

  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [userComment, setUserComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [showCommentSuccess, setShowCommentSuccess] = useState(false);

  const isFav = favorites.some(item => item.id === product.id);
  const isLimitInsufficient = virtualCard.limit < product.discountPrice;

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize);
    alert('Ürün başarıyla sepete eklendi! 🛒');
  };

  const handleFavoriteClick = () => {
    toggleFavorite(product);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    const newReview = {
      id: `user-rev-${Date.now()}`,
      user: virtualCard.cardHolder === 'MİSAFİR KULLANICI' ? 'Siz (Misafir)' : virtualCard.cardHolder,
      rating: userRating,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      comment: userComment,
      likes: 0
    };

    setReviewsList(prev => [newReview, ...prev]);
    setUserComment('');
    setUserRating(5);
    setShowCommentSuccess(true);
    setTimeout(() => setShowCommentSuccess(false), 3000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 16px', paddingBottom: '80px' }}>
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-sub)',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} />
        Geri Dön
      </button>

      {/* Insufficient Limit Banner Warning */}
      {isLimitInsufficient && (
        <div style={{
          backgroundColor: 'var(--error-light)',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)' }}>
            <ShieldAlert size={20} />
            <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
              Bakiye Uyarısı: Sanal cüzdan limitiniz ({virtualCard.limit} TL) bu ürünün fiyatını karşılamıyor!
            </span>
          </div>
          <button 
            onClick={() => triggerLimitBoostAd()}
            className="btn btn-primary animate-pulse"
            style={{ fontSize: '12.5px', padding: '6px 12px', borderRadius: '4px', backgroundColor: 'var(--error)' }}
          >
            <Sparkles size={12} />
            Hemen Limit Yükle (+3000 TL)
          </button>
        </div>
      )}

      {/* Main Detail Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 480px) 1fr',
        gap: '40px',
        alignItems: 'start'
      }}
      className="detail-grid-responsive"
      >
        
        {/* Left Side: Photo Gallery */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ width: '100%', height: '480px', position: 'relative' }}>
            <img 
              src={product.images[0]} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header information */}
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.2', color: '#111', marginBottom: '8px' }}>
              <span style={{ color: 'var(--brand)', marginRight: '6px' }}>{product.brand}</span>
              {product.name.replace(product.brand, '').trim()}
            </h1>
            
            {/* Category / Badges info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Kategori: {product.categoryName}</span>
              {product.bestSeller && (
                <span className="badge badge-orange" style={{ fontSize: '9px' }}>Çok Satan Ürün</span>
              )}
              {product.flashSale && (
                <span className="badge badge-green" style={{ fontSize: '9px' }}>Flaş İndirim</span>
              )}
            </div>
          </div>

          {/* Ratings Block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#ffb800', fontWeight: '700', fontSize: '14.5px' }}>
              {product.rating} <Star size={16} fill="#ffb800" style={{ marginLeft: '4px' }} />
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>|</span>
            <span style={{ fontSize: '13px', color: 'var(--text-sub)', fontWeight: '600' }}>
              {product.reviewCount.toLocaleString('tr-TR')} Değerlendirme
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>|</span>
            <span style={{ fontSize: '13px', color: 'var(--success)', fontWeight: '600' }}>
              {product.favoriteCount.toLocaleString('tr-TR')} Takipçi
            </span>
          </div>

          {/* Price Block */}
          <div style={{ backgroundColor: '#fffcf9', border: '1px solid #ffe3d1', borderRadius: '8px', padding: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Sanal Satış Fiyatı</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              {product.discountPercent > 0 ? (
                <>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--brand)' }}>
                    {product.discountPrice.toLocaleString('tr-TR')} TL
                  </span>
                  <span style={{ fontSize: '16px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {product.price.toLocaleString('tr-TR')} TL
                  </span>
                  <span style={{ fontSize: '13px', backgroundColor: 'var(--brand)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    %{product.discountPercent} İNDİRİM
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>
                  {product.price.toLocaleString('tr-TR')} TL
                </span>
              )}
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              *Kargo Ücretsiz (200 TL üzeri alışverişlerinizde)
            </p>
          </div>

          {/* Size Select Block (For Giyim) */}
          {(product.category === 'kadin' || product.category === 'erkek') && (
            <div>
              <p style={{ fontSize: '13.5px', fontWeight: '700', marginBottom: '8px' }}>Beden Seçiniz:</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '6px',
                      border: '2px solid',
                      borderColor: selectedSize === size ? 'var(--brand)' : 'var(--border)',
                      backgroundColor: selectedSize === size ? 'white' : 'var(--bg-sub)',
                      color: selectedSize === size ? 'var(--brand)' : 'var(--text-main)',
                      fontWeight: '700',
                      fontSize: '14px',
                      transition: 'var(--transition)'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Call to Actions */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flex: 1, padding: '16px 20px', borderRadius: '8px', fontSize: '15px' }}
            >
              <ShoppingCart size={18} />
              Sepete Ekle (Simüle)
            </button>

            <button 
              onClick={handleFavoriteClick}
              className="btn btn-outline"
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)',
                color: isFav ? 'var(--error)' : 'var(--text-muted)'
              }}
            >
              <Heart size={20} fill={isFav ? 'var(--error)' : 'none'} />
            </button>
          </div>

          {/* Specifications Table */}
          <div style={{ marginTop: '10px' }}>
            <h4 style={{ fontSize: '14.5px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              Ürün Özellikleri
            </h4>
            <div style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
              {product.specifications.map((spec, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '150px 1fr',
                    fontSize: '13px',
                    borderBottom: index === product.specifications.length - 1 ? 'none' : '1px solid var(--border)',
                    backgroundColor: index % 2 === 0 ? '#fcfcfc' : 'white'
                  }}
                >
                  <span style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--text-sub)', borderRight: '1px solid var(--border)' }}>{spec.name}</span>
                  <span style={{ padding: '10px 12px', color: 'var(--text-main)' }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Description Panel */}
      <div style={{
        marginTop: '40px',
        backgroundColor: 'white',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
          Ürün Açıklaması
        </h3>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-sub)' }}>
          {product.description}
        </p>
      </div>

      {/* Reviews Panel */}
      <div style={{
        marginTop: '30px',
        backgroundColor: 'white',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
          Ürün Yorumları ({reviewsList.length})
        </h3>

        {/* User Custom Comment Form (Engaging Dopamine booster) */}
        <div style={{
          backgroundColor: '#fafafa',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontSize: '13.5px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Ürüne Yorum Yaz (Sanal Değerlendirme)</span>
          </h4>
          
          <form onSubmit={handlePostComment}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-sub)' }}>Puanınız:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    style={{ color: star <= userRating ? '#ffb800' : 'var(--text-muted)' }}
                  >
                    <Star size={18} fill={star <= userRating ? '#ffb800' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <textarea
                placeholder="Bu simüle edilmiş ürün hakkında ne düşünüyorsunuz? Yorumunuz hemen listelenecektir..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  height: '60px',
                  resize: 'none'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '10px 18px', borderRadius: '6px', height: '42px' }}
              >
                <Send size={14} />
                Gönder
              </button>
            </div>

            {showCommentSuccess && (
              <p style={{ color: 'var(--success)', fontSize: '12.5px', fontWeight: 'bold', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} />
                Yorumunuz "Satın Alımı Doğrulandı" rozetiyle başarıyla eklendi!
              </p>
            )}
          </form>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviewsList.map((review) => (
            <div 
              key={review.id}
              style={{
                borderBottom: '1px solid var(--border)',
                paddingBottom: '16px'
              }}
            >
              {/* Star Rating & Buyer Name */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={12} 
                        fill={star <= review.rating ? '#ffb800' : 'none'} 
                        style={{ color: star <= review.rating ? '#ffb800' : 'var(--text-muted)' }} 
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {review.user}
                  </span>
                  
                  {/* Verified Buyer Badge */}
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <Check size={10} />
                    Alıcı
                  </span>
                </div>
                
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{review.date}</span>
              </div>

              {/* Comment text */}
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-sub)' }}>
                {review.comment}
              </p>

              {/* Likes counter */}
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                <span>Bu yorum yardımcı oldu mu?</span>
                <button 
                  onClick={() => alert('Trendbol yorum desteği simüle edilmiştir!')}
                  style={{ color: 'var(--text-sub)', fontWeight: '600' }}
                >
                  Evet ({review.likes})
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Embedded CSS overrides */}
      <style>{`
        @media (max-width: 768px) {
          .detail-grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>

    </div>
  );
}
