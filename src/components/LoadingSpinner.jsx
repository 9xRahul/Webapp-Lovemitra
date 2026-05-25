import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', gap: '15px' }}>
      <Loader className="spinner" size={40} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
      <div className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{text}</div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
