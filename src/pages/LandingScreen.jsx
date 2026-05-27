import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Heart } from 'lucide-react';
import { auth } from '../firebase';
import api from '../services/api';

const HeartsBackground = React.memo(() => {
  const hearts = useMemo(() => {
    return Array.from({ length: 450 }).map((_, i) => {
      const size = Math.random() * 40 + 10; // 10px to 50px
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const opacity = Math.random() * 0.4 + 0.1; // 0.1 to 0.5
      const blur = Math.random() * 8 + 1; // 1px to 9px
      const rotate = Math.random() * 360;
      
      return (
        <Heart 
          key={i}
          fill="currentColor"
          className="absolute text-primary-start"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: opacity,
            filter: `blur(${blur}px)`,
            transform: `rotate(${rotate}deg)`
          }}
        />
      );
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {hearts}
    </div>
  );
});

const LandingScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAppDialog, setShowAppDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Firebase Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      // The backend /auth/signup endpoint handles both login (returns existing) and signup
      await api.post('/auth/signup', { idToken });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    setShowAppDialog(true);
  };

  return (
    <>
      <div className="landing-container relative overflow-hidden">
        
        <HeartsBackground />

        <div className="glass-card auth-card relative z-10">
          <h1 className="gradient-text">Welcome Back</h1>
          <p className="subtitle">Find your perfect match today.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Enter your email"
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter your password"
              />
            </div>

            <div className="forgot-password" onClick={handleResetPassword}>
              Forgot Password?
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Login'}
            </button>
          </form>

          <div className="toggle-auth">
            <span>Don't have an account?</span>
            <button className="btn-text" type="button" onClick={() => setShowAppDialog(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {showAppDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative text-center">
            <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-inter">Use the Mobile App</h2>
            <p className="text-gray-600 mb-8 font-inter">
              Please use the LoveMitra mobile app to sign up for a new account or reset your password.
            </p>
            <button 
              onClick={() => setShowAppDialog(false)}
              className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md font-inter"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingScreen;
