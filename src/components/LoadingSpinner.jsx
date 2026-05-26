import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import loadingAnimation from '../assets/lottie/loading.json';

const LoadingSpinner = ({ text = "Loading..." }) => {
  const container = useRef(null);
  const anim = useRef(null);

  useEffect(() => {
    if (container.current) {
      try {
        anim.current = lottie.loadAnimation({
          container: container.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: loadingAnimation,
        });
      } catch (err) {
        console.error("Lottie initialization error:", err);
      }
    }

    return () => {
      if (anim.current) {
        anim.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', gap: '15px' }}>
      <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div ref={container} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 2 }}></div>
      </div>
      <div className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{text}</div>
    </div>
  );
};

export default LoadingSpinner;
