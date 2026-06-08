import React from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, CreditCard, Sparkles } from 'lucide-react';

export default function VirtualCard() {
  const { virtualCard, triggerLimitBoostAd } = useApp();

  const handleBoostLimit = () => {
    triggerLimitBoostAd((reward) => {
      // Confetti is already played in AdSimulator
      console.log(`Boosted by ${reward} TL!`);
    });
  };

  const spentPercentage = virtualCard.maxLimit > 0 
    ? (virtualCard.limit / virtualCard.maxLimit) * 100 
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%' }}>
      
      {/* 3D Glassmorphic Card */}
      <div className="virtual-card-wrapper">
        <div className="virtual-card animate-float">
          <div className="card-gloss"></div>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-logo">trendbol <span style={{ fontSize: '10px', opacity: 0.8, fontWeight: 'normal' }}>cüzdan</span></span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', opacity: 0.9 }}>VISA</span>
          </div>

          {/* Chip */}
          <div className="card-chip"></div>

          {/* Card Number */}
          <div className="card-number">{virtualCard.cardNumber}</div>

          {/* Footer details */}
          <div className="card-footer">
            <div>
              <div className="card-info-label">Kart Sahibi</div>
              <div className="card-info-value">{virtualCard.cardHolder}</div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div className="card-info-label">Sanal Bakiye</div>
              <div className="card-info-value" style={{ fontSize: '16px', fontWeight: '800' }}>
                {virtualCard.limit.toLocaleString('tr-TR')} TL
              </div>
            </div>
          </div>

          {/* Limit Bar */}
          <div className="card-limit-indicator">
            <div 
              className="card-limit-progress" 
              style={{ width: `${spentPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Limit details and boost trigger */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        backgroundColor: 'white',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-sub)', marginBottom: '8px' }}>
          <span>Harcanabilir Limit:</span>
          <strong>{virtualCard.limit.toLocaleString('tr-TR')} TL</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-sub)', marginBottom: '16px' }}>
          <span>Toplam Limit:</span>
          <strong>{virtualCard.maxLimit.toLocaleString('tr-TR')} TL</strong>
        </div>

        {/* Boost Limit Button */}
        <button 
          onClick={handleBoostLimit}
          className="btn btn-primary animate-pulse-local"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px'
          }}
        >
          <PlusCircle size={18} />
          <span>Reklam İzle, Limiti Yükle (+1000-5000 TL)</span>
          <Sparkles size={16} />
        </button>
      </div>

      <style>{`
        @keyframes pulse-border {
          0% { box-shadow: 0 0 0 0 rgba(255, 115, 0, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(255, 115, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 115, 0, 0); }
        }
        .animate-pulse-local {
          animation: pulse-border 2s infinite;
        }
      `}</style>

    </div>
  );
}
