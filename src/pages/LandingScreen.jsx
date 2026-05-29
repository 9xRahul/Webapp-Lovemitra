import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
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
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        try {
          const res = await api.get('/users/me');
          const dbUser = res.data.data.user;
          if (dbUser.isEmailVerified) {
            navigate('/dashboard', { replace: true });
          } else if (user.emailVerified) {
            await api.patch('/users/updateMe', { is_email_verified: true });
            navigate('/dashboard', { replace: true });
          } else {
            setShowVerificationDialog(true);
          }
        } catch (e) {
          // Fallback if backend fetch fails
          if (user.emailVerified) {
            navigate('/dashboard', { replace: true });
          } else {
            setShowVerificationDialog(true);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Continuously check for email verification when the dialog is open
  useEffect(() => {
    let interval;
    if (showVerificationDialog && auth.currentUser) {
      interval = setInterval(async () => {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          try {
            await api.patch('/users/updateMe', { is_email_verified: true });
          } catch (e) {
            console.error("Failed to update email verification flag in DB", e);
          }
          setShowVerificationDialog(false);
          clearInterval(interval);
          navigate('/dashboard', { replace: true });
        }
      }, 3000); // Check every 3 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showVerificationDialog, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Firebase Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const idToken = await userCredential.user.getIdToken();
      // The backend /auth/signup endpoint handles both login (returns existing) and signup
      const res = await api.post('/auth/signup', { idToken });
      const dbUser = res.data.data.user;

      if (!dbUser.isEmailVerified) {
        if (userCredential.user.emailVerified) {
          try {
            await api.patch('/users/updateMe', { is_email_verified: true });
          } catch (e) {}
          navigate('/dashboard', { replace: true });
        } else {
          setShowVerificationDialog(true);
        }
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    setResetEmail(email.includes('@') ? email : '');
    setResetStatus('');
    setShowAppDialog(true);
  };

  const handleSendResetLink = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      setResetStatus('Please enter a valid email address');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetStatus('Password reset email sent! Please check your inbox.');
      setTimeout(() => {
        setShowAppDialog(false);
        setResetStatus('');
      }, 3000);
    } catch (err) {
      setResetStatus(err.message || 'Failed to send reset email.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowVerificationDialog(false);
  };

  const handleResendEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setResendStatus('Verification email sent!');
        setTimeout(() => setResendStatus(''), 3000);
      } catch (err) {
        setResendStatus('Failed to send email. Try again later.');
      }
    }
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
              <button className="btn-text !text-primary-start hover:!text-primary-end font-bold ml-2" type="button" onClick={() => navigate('/signup')}>
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
              onClick={() => {
                setShowAppDialog(false);
                setResetStatus('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-inter text-primary-start">Reset Password</h2>
            <p className="text-gray-600 mb-6 font-inter leading-relaxed">
              Enter your email address to receive a password reset link.
            </p>

            <div className="text-left mb-6">
              <input 
                type="email" 
                value={resetEmail} 
                onChange={(e) => setResetEmail(e.target.value)} 
                required 
                placeholder="Email address"
                className="w-full !rounded-xl border-gray-200 !bg-gray-50 !text-gray-900 placeholder:text-gray-400 focus:border-primary-start focus:ring-1 focus:ring-primary-start transition-all px-4 py-3"
              />
              {resetStatus && (
                <p className={`mt-2 text-sm font-medium ${resetStatus.includes('sent') ? 'text-green-600' : 'text-primary-start'}`}>
                  {resetStatus}
                </p>
              )}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setShowAppDialog(false);
                  setResetStatus('');
                }}
                className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl transition-all hover:bg-gray-200 font-inter text-base"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendResetLink}
                className="flex-1 bg-brand-gradient text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 font-inter text-base"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}

      {showVerificationDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4 transition-opacity">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl relative text-center">
            <div className="w-20 h-20 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-inter">Email Not Verified</h2>
            <p className="text-gray-600 mb-8 font-inter leading-relaxed">
              Please check your inbox and verify your email address to continue using LoveMitra.
            </p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleResendEmail}
                className="w-full bg-white text-primary-start border-2 border-primary-start font-bold py-3 rounded-xl transition-all hover:bg-primary-start/5 font-inter text-lg"
              >
                Resend Verification Email
              </button>
              {resendStatus && <p className="text-sm text-green-600 font-medium">{resendStatus}</p>}

              <button 
                onClick={handleLogout}
                className="w-full bg-brand-gradient text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 font-inter text-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingScreen;
