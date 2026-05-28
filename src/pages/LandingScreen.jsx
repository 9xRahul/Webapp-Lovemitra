import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Heart } from 'lucide-react';
import { auth } from '../firebase';
import api from '../services/api';

  const HeartsBackground = React.memo(() => {
    const hearts = useMemo(() => {
      return Array.from({ length: 75 }).map((_, i) => {
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

        <div className="glass-card auth-card relative z-10 !max-w-4xl !p-0 overflow-hidden flex flex-col md:flex-row shadow-2xl border-0">
          
          {/* Left Side - Info Panel */}
          <div className="flex flex-col items-center justify-center p-8 md:p-12 w-full md:w-1/2 bg-brand-gradient text-white relative overflow-hidden">
            {/* Soft decorative background circles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute bottom-[-10%] right-[-20%] w-80 h-80 rounded-full bg-black/10 blur-3xl"></div>
            </div>

            <img src="/app_logo.png" alt="LoveMitra" className="w-32 h-32 object-contain mb-8 drop-shadow-2xl bg-white rounded-[2rem] p-3 shadow-xl relative z-10" />
            <h2 className="text-4xl font-bold mb-4 font-inter relative z-10">LoveMitra</h2>
            <p className="text-white/90 text-center font-medium leading-relaxed font-inter relative z-10 text-base md:text-lg">
              Connect with thousands of singles ready to start a meaningful journey. 
              Experience the safest, most trusted matchmaking platform built just for you.
            </p>
            
            <div className="mt-8 md:mt-12 flex gap-8 text-white/80 relative z-10">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-1">1M+</span>
                <span className="text-xs uppercase tracking-widest font-bold">Matches</span>
              </div>
              <div className="w-px h-14 bg-white/30"></div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-1">100%</span>
                <span className="text-xs uppercase tracking-widest font-bold">Verified</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white/95 backdrop-blur-md">
            {/* Mobile Logo Fallback */}
            <img src="/app_logo.png" alt="LoveMitra" className="w-20 h-20 object-contain mx-auto mb-6 md:hidden rounded-2xl p-1 shadow-sm border border-gray-100" />
            
            <h1 className="gradient-text !text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-500 mb-8 font-inter text-sm">Enter your details to securely access your account.</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form w-full text-left">
              <div className="input-group">
                <label className="font-semibold text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="Enter your email"
                  className="!rounded-xl border-gray-200 !bg-gray-50 !text-gray-900 placeholder:text-gray-400 focus:border-primary-start focus:ring-1 focus:ring-primary-start transition-all"
                />
              </div>
              <div className="input-group mt-5">
                <label className="font-semibold text-gray-700">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Enter your password"
                  className="!rounded-xl border-gray-200 !bg-gray-50 !text-gray-900 placeholder:text-gray-400 focus:border-primary-start focus:ring-1 focus:ring-primary-start transition-all"
                />
              </div>

              <div className="forgot-password text-right mt-2 hover:text-primary-start font-medium cursor-pointer transition-colors" onClick={handleResetPassword}>
                Forgot Password?
              </div>

              <button type="submit" className="w-full gradient-button !py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 mt-8" disabled={loading}>
                {loading ? 'Authenticating...' : 'Login Securely'}
              </button>
            </form>

            <div className="toggle-auth mt-8 pt-6 border-t border-gray-100">
              <span className="text-gray-500 font-inter">Don't have an account?</span>
              <button className="btn-text !text-primary-start hover:!text-primary-end font-bold ml-2" type="button" onClick={() => setShowAppDialog(true)}>
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAppDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 transition-opacity">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl relative text-center">
            <button 
              onClick={() => setShowAppDialog(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <div className="w-20 h-20 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-inter">Use the Mobile App</h2>
            <p className="text-gray-600 mb-8 font-inter leading-relaxed">
              To keep our community safe and verified, please use the LoveMitra mobile app to create a new account or reset your password.
            </p>
            <button 
              onClick={() => setShowAppDialog(false)}
              className="w-full bg-brand-gradient text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 font-inter text-lg"
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
