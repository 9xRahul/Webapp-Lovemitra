import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const REPORT_REASONS = [
  'Inappropriate Content',
  'Spam / Scam',
  'Fake Profile',
  'Harassment or Abuse',
  'Other'
];

const ReportUserModal = ({ isOpen, onClose, onReport, targetName, isLoading = false }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [explanation, setExplanation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedReason) return;
    onReport({
      reason: selectedReason,
      details: explanation.trim()
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#1c1c1e', borderRadius: '25px', padding: '0', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          <button style={{ position: 'absolute', right: '15px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }} onClick={onClose}>
            <X size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4b4b', fontWeight: '600', fontSize: '1.2rem' }}>
            <AlertTriangle size={20} /> Report {targetName}
          </div>
        </div>
        
        <div style={{ padding: '20px', overflowY: 'auto' }}>
          <p style={{ color: '#ccc', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>
            We take your safety seriously. Please let us know why you are reporting this user.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {REPORT_REASONS.map((reason) => (
              <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', background: selectedReason === reason ? 'rgba(255, 75, 75, 0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedReason === reason ? 'rgba(255, 75, 75, 0.3)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedReason === reason ? '#ff4b4b' : '#666'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedReason === reason && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff4b4b' }} />}
                </div>
                <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: selectedReason === reason ? '500' : 'normal' }}>{reason}</span>
                <input 
                  type="radio" 
                  name="report-reason" 
                  value={reason} 
                  checked={selectedReason === reason} 
                  onChange={() => setSelectedReason(reason)}
                  style={{ display: 'none' }}
                />
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#aaa', fontSize: '0.9rem' }}>Additional Details (Optional)</label>
            <textarea 
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Provide more context..."
              style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: 'white', fontSize: '0.95rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            onClick={handleSubmit}
            disabled={!selectedReason || isLoading}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#ff4b4b', color: 'white', border: 'none', fontWeight: '600', fontSize: '1rem', cursor: (!selectedReason || isLoading) ? 'not-allowed' : 'pointer', opacity: (!selectedReason || isLoading) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }}
          >
            {isLoading ? <div style={{width: 20, height: 20, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} /> : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportUserModal;
