import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, MailOpen, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function Inbox() {
  const { inbox, markEmailAsRead, deleteEmail } = useApp();
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  // Automatically select the first email if list isn't empty
  useEffect(() => {
    if (inbox.length > 0 && !selectedEmailId) {
      setSelectedEmailId(inbox[0].id);
      markEmailAsRead(inbox[0].id);
    }
  }, [inbox, selectedEmailId, markEmailAsRead]);

  const handleSelectEmail = (email) => {
    setSelectedEmailId(email.id);
    markEmailAsRead(email.id);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteEmail(id);
    if (selectedEmailId === id) {
      setSelectedEmailId(null);
    }
  };

  const selectedEmail = inbox.find(email => email.id === selectedEmailId);

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 16px' }}>
      
      {/* Page Title */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Mail size={24} style={{ color: 'var(--brand)' }} />
        <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Trendbol Posta Kutum</h2>
        <span style={{ fontSize: '12px', backgroundColor: 'var(--brand-light)', color: 'var(--brand)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
          {inbox.filter(e => !e.read).length} okunmamış
        </span>
      </div>

      {inbox.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '60px 16px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <MailOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Posta Kutunuz Boş</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Burada alışveriş fişleriniz ve cargo takip e-postalarınız yer alacaktır.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '20px',
          backgroundColor: 'white',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '600px',
          boxShadow: 'var(--shadow-sm)'
        }}
        className="inbox-layout"
        >
          {/* Left Pane: Email List */}
          <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto', maxHeight: '650px', backgroundColor: '#fafafa' }}>
            {inbox.map((email) => (
              <div
                key={email.id}
                onClick={() => handleSelectEmail(email)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  backgroundColor: selectedEmailId === email.id ? '#fff3e6' : 'transparent',
                  borderLeft: selectedEmailId === email.id ? '4px solid var(--brand)' : '4px solid transparent',
                  position: 'relative',
                  transition: 'var(--transition)'
                }}
                className="email-list-item"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} />
                    {email.date.split(' ')[0]}
                  </span>
                  
                  {/* Delete button */}
                  <button 
                    onClick={(e) => handleDelete(email.id, e)}
                    style={{ color: 'var(--text-muted)', hoverColor: 'var(--error)' }}
                    className="email-delete-btn"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                
                {/* Subject & Unread Marker */}
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: !email.read ? '800' : '600',
                  color: !email.read ? 'black' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px'
                }}>
                  {!email.read && (
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand)',
                      flexShrink: 0
                    }} />
                  )}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {email.subject}
                  </span>
                </h4>
                
                <p style={{ fontSize: '12px', color: 'var(--text-sub)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Gönderen: {email.sender.split(' <')[0]}
                </p>
              </div>
            ))}
          </div>

          {/* Right Pane: Email Reader */}
          <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '650px', display: 'flex', flexDirection: 'column' }}>
            {selectedEmail ? (
              <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                {/* Meta details */}
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: '#111' }}>
                    {selectedEmail.subject}
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-sub)', fontSize: '13px' }}>
                    <div>
                      <p><strong>Gönderen:</strong> {selectedEmail.sender}</p>
                      <p><strong>Alıcı:</strong> Size &lt;{inbox[0]?.sender?.includes(inbox[0]?.sender?.split(' ')[0]) ? 'kullanici@trendbol.com' : 'simulasyon@trendbol.com'}&gt;</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p>{selectedEmail.date}</p>
                    </div>
                  </div>
                </div>

                {/* Email HTML Body */}
                <div 
                  style={{ flex: 1, overflowX: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                />
                
              </div>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                <Mail size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <p style={{ fontSize: '14px' }}>Lütfen okumak istediğiniz e-postayı soldaki menüden seçin.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded CSS */}
      <style>{`
        @media (max-width: 768px) {
          .inbox-layout {
            grid-template-columns: 1fr !important;
          }
          .email-list-item {
            border-bottom: 2px solid var(--border) !important;
          }
        }
        .email-delete-btn:hover {
          color: var(--error) !important;
        }
      `}</style>

    </div>
  );
}
