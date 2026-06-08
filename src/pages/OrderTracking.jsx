import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Truck, Calendar, ArrowRight, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function OrderTracking() {
  const { orders, triggerCargoSpeedUpAd } = useApp();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const handleSpeedUp = (orderId, e) => {
    e.stopPropagation();
    triggerCargoSpeedUpAd(orderId, () => {
      // Confetti or visual effects played in AdSimulator
      console.log(`Cargo speed up successful for order: ${orderId}`);
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'received': return 'Sipariş Alındı';
      case 'preparing': return 'Hazırlanıyor';
      case 'shipped': return 'Kargoya Verildi';
      case 'in-transit': return 'Dağıtımda';
      case 'delivered': return 'Teslim Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const stages = [
    { key: 'received', label: 'Sipariş Alındı', desc: 'Siparişiniz başarıyla oluşturuldu.' },
    { key: 'preparing', label: 'Hazırlanıyor', desc: 'Satıcı siparişinizi paketliyor.' },
    { key: 'shipped', label: 'Kargoya Verildi', desc: 'Trendbol Express kargonuzu teslim aldı.' },
    { key: 'in-transit', label: 'Dağıtımda', desc: 'Kuryemiz teslimat için yola çıktı.' },
    { key: 'delivered', label: 'Teslim Edildi', desc: 'Kargonuz adresinize teslim edilmiştir.' }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 16px', paddingBottom: '80px' }}>
      
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Package size={24} style={{ color: 'var(--brand)' }} />
        <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Siparişlerim & Kargo Takip</h2>
      </div>

      {orders.length === 0 ? (
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
          <Truck size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Henüz Siparişiniz Yok</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Simülasyon kartınızdaki limitlerle popüler ürünler satın alarak sipariş oluşturabilirsiniz.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentStageIndex = stages.findIndex(s => s.key === order.trackingStatus);

            return (
              <div 
                key={order.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition)'
                }}
              >
                
                {/* Order Summary Row (Click to Expand) */}
                <div 
                  onClick={() => toggleExpand(order.id)}
                  style={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: isExpanded ? '#fffcf9' : 'white',
                    borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      backgroundColor: order.trackingStatus === 'delivered' ? 'var(--success-light)' : 'var(--brand-light)',
                      color: order.trackingStatus === 'delivered' ? 'var(--success)' : 'var(--brand)',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Truck size={20} />
                    </div>
                    
                    <div>
                      <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: '#111' }}>
                        Sipariş No: {order.id}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Calendar size={12} />
                        {order.date}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toplam Tutar</span>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--brand)' }}>{order.total.toLocaleString('tr-TR')} TL</div>
                    </div>
                    
                    <div>
                      <span className={`badge ${order.trackingStatus === 'delivered' ? 'badge-light-green' : 'badge-light-orange'}`} style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'none' }}>
                        {getStatusText(order.trackingStatus)}
                      </span>
                    </div>

                    {/* Cargo Speed Up Action (if cargo is not delivered) */}
                    {order.trackingStatus !== 'delivered' && (
                      <button 
                        onClick={(e) => handleSpeedUp(order.id, e)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '11px', gap: '4px' }}
                      >
                        <Sparkles size={11} />
                        Kargoyu Hızlandır (Ad)
                      </button>
                    )}

                    <div>
                      {isExpanded ? <ChevronUp size={20} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                  </div>

                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }} className="order-details-responsive">
                    
                    {/* Left: Cargo Shipment Stages Timeline */}
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Kargo Taşıma Durumu</h4>
                      
                      <div className="cargo-timeline">
                        {stages.map((stage, idx) => {
                          const isCompleted = idx < currentStageIndex;
                          const isActive = idx === currentStageIndex;
                          
                          let statusClass = '';
                          if (isCompleted) statusClass = 'completed';
                          else if (isActive) statusClass = 'active';

                          return (
                            <div key={stage.key} className={`cargo-step ${statusClass}`}>
                              <div className="cargo-node">
                                {isCompleted && <CheckCircle2 size={14} />}
                              </div>
                              <h5 style={{ 
                                fontSize: '13.5px', 
                                fontWeight: isActive ? '800' : (isCompleted ? '600' : 'normal'),
                                color: isActive ? 'var(--brand)' : (isCompleted ? 'var(--text-main)' : 'var(--text-muted)') 
                              }}>
                                {stage.label}
                              </h5>
                              <p style={{ fontSize: '11.5px', color: 'var(--text-sub)' }}>{stage.desc}</p>
                              
                              {/* Show status update timestamp if available in order history */}
                              {order.trackingHistory.find(h => h.status === stage.key) && (
                                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                  Güncelleme: {order.trackingHistory.find(h => h.status === stage.key).time}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Products List in Order */}
                    <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '24px' }} className="order-items-responsive">
                      <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Sipariş Edilen Ürünler</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              style={{ width: '44px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} 
                            />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <p style={{ fontSize: '12px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.product.brand} {item.product.name.replace(item.product.brand, '').trim()}
                              </p>
                              <p style={{ fontSize: '11px', color: 'var(--text-sub)' }}>
                                {item.quantity} Adet x {item.product.discountPrice.toLocaleString('tr-TR')} TL
                              </p>
                              {item.selectedSize && (
                                <span style={{ fontSize: '9px', backgroundColor: 'var(--bg-sub)', padding: '1px 4px', borderRadius: '2px', color: 'var(--text-muted)' }}>
                                  Beden: {item.selectedSize}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Embedded CSS overrides */}
      <style>{`
        @media (max-width: 768px) {
          .order-details-responsive {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .order-items-responsive {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid var(--border) !important;
            padding-top: 20px !important;
          }
        }
      `}</style>

    </div>
  );
}
