import React from 'react';

const ConfirmActionModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = true, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '350px', background: '#1c1c1e', borderRadius: '20px', padding: '25px', textAlign: 'center', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ margin: '0 0 10px', color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>{title}</h3>
        <p style={{ color: '#ccc', fontSize: '0.95rem', marginBottom: '25px', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onClose}
            disabled={isLoading}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', background: isDestructive ? '#ff4b4b' : 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? <div style={{width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
