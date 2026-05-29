import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { Heart } from 'lucide-react';
import { auth } from '../firebase';
import { AuthService } from '../services/api';
import indianCities from '../assets/indian_cities.json';

const HeartsBackground = React.memo(() => {
  const hearts = useMemo(() => {
    return Array.from({ length: 75 }).map((_, i) => {
      const size = Math.random() * 40 + 10;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const opacity = Math.random() * 0.4 + 0.1;
      const blur = Math.random() * 8 + 1;
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

const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };
};

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    mobile: '',
    city: '',
    gender: 'Male', // Default to Male as per backend enum ['Male', 'Female']
    dob: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Validation States
  const [emailUnique, setEmailUnique] = useState(null);
  const [mobileUnique, setMobileUnique] = useState(null);

  const checkEmail = async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    try {
      const res = await AuthService.checkEmail(email);
      setEmailUnique(res.data.isUnique);
      if (!res.data.isUnique) {
        setErrors(prev => ({ ...prev, email: 'Email is already in use.' }));
      } else {
        setErrors(prev => ({ ...prev, email: null }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkMobile = async (mobile) => {
    if (!mobile || mobile.length < 10) return;
    try {
      const res = await AuthService.checkMobile(mobile);
      setMobileUnique(res.data.isUnique);
      if (!res.data.isUnique) {
        setErrors(prev => ({ ...prev, mobile: 'Mobile number is already in use.' }));
      } else {
        setErrors(prev => ({ ...prev, mobile: null }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedCheckEmail = useCallback(debounce(checkEmail, 500), []);
  const debouncedCheckMobile = useCallback(debounce(checkMobile, 500), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Trigger debounced validation
    if (name === 'email') debouncedCheckEmail(value);
    if (name === 'mobile') debouncedCheckMobile(value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required.';
    
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    else if (emailUnique === false) newErrors.email = 'Email is already in use.';

    if (!formData.mobile) newErrors.mobile = 'Mobile number is required.';
    else if (mobileUnique === false) newErrors.mobile = 'Mobile number is already in use.';

    if (!formData.city) newErrors.city = 'City is required.';

    if (!formData.dob) newErrors.dob = 'Date of birth is required.';
    else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < 18) newErrors.dob = 'You must be at least 18 years old.';
    }

    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    else if (!/^[a-zA-Z0-9]+$/.test(formData.password)) newErrors.password = 'Password must be alphanumeric.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // 1. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Send Email Verification
      await sendEmailVerification(user);

      // 3. Get ID Token
      const idToken = await user.getIdToken();

      // 4. Create Profile in Backend
      await AuthService.signup({
        idToken,
        first_name: formData.firstName,
        email: formData.email,
        mobile: formData.mobile,
        city: formData.city,
        gender: formData.gender,
        dob: formData.dob
      });

      // 5. Show Success Dialog
      setShowSuccessDialog(true);
    } catch (err) {
      console.error(err);
      setErrors(prev => ({ ...prev, submit: err.message || 'An error occurred during signup.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <>
      <div className="landing-container relative overflow-hidden min-h-screen py-10 overflow-y-auto">
        <HeartsBackground />

        <div className="glass-card relative z-10 w-full max-w-2xl mx-auto p-8 md:p-12 shadow-2xl border-0 mt-8 mb-8 bg-white/95 backdrop-blur-md">
          <div className="text-center mb-8">
            <img src="/app_logo.png" alt="LoveMitra" className="w-20 h-20 object-contain mx-auto mb-4 rounded-2xl p-1 shadow-sm border border-gray-100" />
            <h1 className="gradient-text !text-3xl font-bold mb-2">Create an Account</h1>
            <p className="text-gray-500 font-inter text-sm">Join LoveMitra and find your perfect match.</p>
          </div>

          {errors.submit && <div className="error-message mb-6">{errors.submit}</div>}

          <form onSubmit={handleSubmit} className="auth-form w-full text-left space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div className="input-group">
                <label className="font-semibold text-gray-700 text-sm">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                  placeholder="John"
                  className="!rounded-xl border-gray-200 !bg-gray-50 !text-gray-900 placeholder:text-gray-400 focus:border-primary-start focus:ring-1 focus:ring-primary-start transition-all"
                />
                {errors.firstName && <span className="text-red-500 text-xs mt-1 block">{errors.firstName}</span>}
              </div>

              {/* Mobile */}
              <div className="input-group">
                <label className="font-semibold text-gray-700 text-sm">Mobile Number</label>
                <input 
                  type="text" 
                  name="mobile"
                  value={formData.mobile} 
                  onChange={handleChange} 
                  required 
                  placeholder="+91..."
                  className="!rounded-xl border-gray-200 !bg-gray-50 !text-gray-900 placeholder:text-gray-400 focus:border-primary-start focus:ring-1 focus:ring-primary-start transition-all"
                />
                {errors.mobile && <span className="text-red-500 text-xs mt-1 block">{errors.mobile}</span>}
                {mobileUnique && !errors.mobile && <span className="text-green-500 text-xs mt-1 block">Mobile is available</span>}
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              <label className="font-semibold text-gray-700 text-sm">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="john@example.com"
                className="!rounded-xl border-gray-200 !bg-gray-50 !text-gray-900 placeholder:text-gray-400 focus:border-primary-start focus:ring-1 focus:ring-primary-start transition-all"
              />
              {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
              {emailUnique && !errors.email && <span className="text-green-500 text-xs mt-1 block">Email is available</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* City */}
              <div className="input-group">
                <label className="font-semibold text-gray-700 text-sm">City</label>
                <input 
                  type="text" 
                  name="city"
                  list="cities-list"
                  value={formData.city} 
                  onChange={handleChange} 
                  required 
                  placeholder="New Delhi"
                  className="!rounded-xl border-gray-200 !bg-gray-50 !text-gray-900 placeholder:text-gray-400 focus:border-primary-start focus:ring-1 focus:ring-primary-start transition-all w-full h-12 px-4"
                />
                <datalist id="cities-list">
                  {indianCities.map(city => (
                    <option key={city.id} value={`${city.name}, ${city.state}`} />
                  ))}
                </datalist>
                {errors.city && <span className="text-red-500 text-xs mt-1 block">{errors.city}</span>}
              </div>

              {/* Gender */}
              <div className="input-group">
                <label className="font-semibold text-gray-700 text-sm">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender} 
                  onChange={handleChange} 
                  required 
                  className="w-full !rounded-xl border-gray-200 !bg-gray-50 !text-gray-900 focus:border-primary-start focus:ring-1 focus:ring-primary-start transition-all h-12 px-4"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* DOB */}
              <div className="input-group">
                <label className="font-semibold text-gray-700 text-sm">Date of Birth</label>
                <input 
                  type="date" 
                  name="dob"
                  value={formData.dob} 
                  onChange={handleChange} 
                  required 
                  className="!rounded-xl border-gray-200 !bg-gray-50 !text-gray-900 focus:border-primary-start focus:ring-1 focus:ring-primary-start transition-all"
                />
                {errors.dob && <span className="text-red-500 text-xs mt-1 block">{errors.dob}</span>}
              </div>

              {/* Password */}
              <div className="input-group">
                <label className="font-semibold text-gray-700 text-sm">Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  placeholder="Min 6 alphanumeric chars"
                  className="!rounded-xl border-gray-200 !bg-gray-50 !text-gray-900 placeholder:text-gray-400 focus:border-primary-start focus:ring-1 focus:ring-primary-start transition-all"
                />
                {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
              </div>
            </div>

            <button type="submit" className="w-full gradient-button !py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 mt-8" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up Securely'}
            </button>
          </form>

          <div className="toggle-auth mt-8 pt-6 border-t border-gray-100 text-center">
            <span className="text-gray-500 font-inter">Already have an account?</span>
            <button className="btn-text !text-primary-start hover:!text-primary-end font-bold ml-2" type="button" onClick={() => navigate('/login')}>
              Log In
            </button>
          </div>
        </div>
      </div>

      {showSuccessDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl relative text-center">
            <div className="w-20 h-20 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-inter">Verify Your Email</h2>
            <p className="text-gray-600 mb-8 font-inter leading-relaxed">
              We've sent a verification email to <strong>{formData.email}</strong>. Please check your inbox and verify your email to continue using LoveMitra.
            </p>
            
            <div className="flex flex-col gap-4">
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

export default Signup;
