import React, { useEffect, useState } from 'react';
import { 
  ChevronLeft, 
  Check, 
  Camera, 
  Edit2, 
  User, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Heart, 
  Plane, 
  Music, 
  Dumbbell, 
  Film, 
  ChefHat, 
  Book, 
  Gamepad2,
  Coffee,
  Wind,
  Wine,
  Utensils,
  Search,
  Users,
  GraduationCap,
  Globe,
  Sparkles,
  LogOut
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { auth } from '../firebase';
import { UserService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ALL_INTERESTS = [
  'Animals / Pets', 'Cars', 'Charity / Volunteering', 'Gadgets', 'Dancing',
  'Hiking / Trekking', 'Internet / Social Media', 'Music', 'Painting / Art',
  'Shopping', 'Photography', 'Reading', 'Sports', 'Theatre / Live Shows',
  'Travelling', 'Writing', 'Gaming', 'Movies', 'Food / Eating Out',
  'Bars / Nightlife', 'Fitness / Gym / Yoga', 'Cooking / Baking',
  'Nature / Outdoors', 'Fashion / Style', 'Spirituality / Meditation',
  'Technology', 'Festivals / Events', 'Family Time', 'Business / Entrepreneurship',
  'Web Series', 'Road Trips / Long Drives', 'Street Food'
];

const ALL_EDUCATIONS = [
  'Higher Secondary / Intermediate',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Professional Degree (CA / CS / LLB / MBBS etc.)',
  'Doctorate / PhD',
  'Postgraduate Diploma',
  'ITI / Vocational Training',
  'Diploma',
  'No formal education',
];

const ALL_PROFESSIONS = [
  'Student', 'Business Person / Entrepreneur', 'Engineering Professional',
  'IT / Software Professional', 'Sales and Marketing', 'Agriculture',
  'Architect / Urban Planner', 'Artificial Intelligence', 'Artist / Entertainer',
  'Aviation / Transportation', 'Beauty Industry', 'Blockchain Developer',
  'Civil Servant (Eg. IAS, IPS)', 'Commercial Marine Service', 'Corporate Executive',
  'Craftsman (Eg. Plumber, Driver)', 'Cybersecurity Expert', 'Data Science',
  'Homemaker', 'Hospitality Industry', 'Law Enforcement', 'Legal Professional',
  'Media / Journalism', 'Mental Health Professional', 'Motion Picture Industry',
  'NFT (Eg. Creator, Marketer)', 'Real Estate / Construction', 'Research Scholar',
  'Retired', 'Scientist / Researcher', 'Social Media Influencer', 'Social Services',
  'Sound Designer / Sound Mixer', 'Sports / Fitness', 'Startup Founder',
  'Stock Trader', 'Teacher / Professor / Administrator', 'Not Employed',
  'Volunteer / Community Service', 'Writer / Publisher', 'Others',
];

const ALL_LANGUAGES = [
  'English', 'Hindi', 'Angami', 'Angika', 'Assamese', 'Bagheli', 'Bengali',
  'Bhili', 'Bodo', 'Chakma', 'Dhivehi', 'Dogri', 'Garhwali', 'Gojri', 'Gondi',
  'Gujarati', 'Kannada', 'Kashmiri', 'Konkani', 'Maithili', 'Malayalam',
  'Manipuri', 'Marathi', 'Nepali', 'Oriya', 'Punjabi', 'Sanskrit', 'Santali',
  'Sindhi', 'Tamil', 'Telugu', 'Urdu',
];

const ALL_STATUSES = [
  'Single', 'Married', 'Married with kids', 'Divorced', 'Divorced with kids',
  'Widowed', 'Widowed with kids', 'Separated', 'Separated with kids', 'Single parent',
];

const ALL_GOALS = [
  'Non-committal relationship', 'Casual relationship, but exclusive',
  'Casual now, long-term relation later', 'New friends', 'Friendship, open to dating',
  'Dating', 'Dating, leading to marriage', 'Marriage, open to dating',
  'Long-term relationship', 'Long-term, fine with short',
  'Fine with both long-term and short-term', 'Open relationship', 'Online companion',
];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const fileInputRef = React.useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showCompletionTooltip, setShowCompletionTooltip] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    age: '',
    gender: 'Male',
    city: '',
    profession: '',
    education: '',
    bio: '',
    interests: [],
    languages: [],
    smoking: 'Non-smoker',
    drinking: 'Non-drinker',
    eating: 'Vegetarian',
    zodiac_sign: '',
    relationship_status: 'Single',
    looking_for: 'Dating',
  });
  
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const completionStats = React.useMemo(() => {
    const fields = [
      { key: 'first_name', label: 'Name' },
      { key: 'age', label: 'Age' },
      { key: 'gender', label: 'Gender' },
      { key: 'city', label: 'City' },
      { key: 'profession', label: 'Profession' },
      { key: 'education', label: 'Education' },
      { key: 'bio', label: 'About Me' },
      { key: 'interests', label: 'Interests', isArray: true },
      { key: 'languages', label: 'Languages', isArray: true },
      { key: 'smoking', label: 'Smoking Habits' },
      { key: 'drinking', label: 'Drinking Habits' },
      { key: 'eating', label: 'Dietary Preferences' },
      { key: 'zodiac_sign', label: 'Zodiac Sign' },
      { key: 'relationship_status', label: 'Relationship Status' },
      { key: 'looking_for', label: 'Looking For' },
    ];

    let completed = 0;
    const missing = [];

    // Check photos
    if (profile?.photos && profile.photos.length > 0) {
      completed++;
    } else {
      missing.push('Photos');
    }

    fields.forEach(f => {
      const val = formData[f.key];
      let isFilled = false;
      if (f.isArray) {
        isFilled = Array.isArray(val) && val.length > 0;
      } else {
        isFilled = val !== undefined && val !== null && String(val).trim() !== '' && val !== 'Not specified' && val !== 'Select';
      }

      if (isFilled) {
        completed++;
      } else {
        missing.push(f.label);
      }
    });

    const totalFields = fields.length + 1;
    const percent = Math.round((completed / totalFields) * 100);
    return { percent, missing };
  }, [formData, profile]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await UserService.getMe();
      if (res.data.status === 'success') {
        const u = res.data.data.user;
        setProfile(u);
        setFormData({ 
          first_name: u.first_name || '', 
          age: u.age || '',
          gender: u.gender || 'Male',
          city: u.city || '', 
          profession: u.profession || '',
          education: u.education || '',
          bio: u.bio || '',
          interests: u.interests || [],
          languages: u.languages || [],
          smoking: u.smoking || 'Non-smoker',
          drinking: u.drinking || 'Non-drinker',
          eating: u.eating || 'Vegetarian',
          zodiac_sign: u.zodiacSign || u.zodiac_sign || '',
          relationship_status: u.relationshipStatus || u.relationship_status || 'Single',
          looking_for: u.lookingFor || u.looking_for || 'Dating',
        });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        zodiacSign: formData.zodiac_sign,
        relationshipStatus: formData.relationship_status,
        lookingFor: formData.looking_for
      };
      
      const res = await UserService.updateMe(dataToSave);
      if (res.data.status === 'success') {
        setProfile(res.data.data.user);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleInterest = (interestId) => {
    if (!isEditing) return;
    setFormData(prev => {
      const current = prev.interests || [];
      if (current.includes(interestId)) {
        return { ...prev, interests: current.filter(id => id !== interestId) };
      } else {
        return { ...prev, interests: [...current, interestId] };
      }
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('photos', file);
      const res = await UserService.uploadPhotos(fd);
      if (res.data.status === 'success') {
        const newUrls = res.data.data.urls;
        if (newUrls && newUrls.length > 0) {
          const currentPhotos = profile.photos || [];
          const updatedPhotos = [newUrls[0], ...currentPhotos.slice(1)];
          setProfile(prev => ({...prev, photos: updatedPhotos}));
          await UserService.updateMe({ photos: updatedPhotos });
        }
      }
    } catch (err) {
      console.error("Failed to upload photo", err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await auth.signOut();
    navigate('/');
  };

  return (
    <div className="profile-premium-container">
      {/* Header */}
      <div className="profile-premium-header">
        <div style={{width: 40}}></div>
        <h1 className="profile-header-title">{isEditing ? 'Edit Profile' : 'Profile'}</h1>
        {isEditing ? (
          <button className="btn-save-top" onClick={handleSave} disabled={saving}>
            <Check size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        ) : (
          <button className="btn-icon-circular" onClick={() => setShowLogoutConfirm(true)}>
            <LogOut size={20} />
          </button>
        )}
      </div>

      {loading ? (
        <div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '60vh'}}>
          <LoadingSpinner text="Loading Profile..." />
        </div>
      ) : !profile ? (
        <div className="page-center" style={{color: 'white'}}>Could not load profile.</div>
      ) : (
        <>
      {/* Avatar Section */}
      <div className="premium-avatar-section">
        <div className="premium-avatar-wrapper">
          <div className="premium-avatar-inner" style={{position: 'relative'}}>
            {profile.photos && profile.photos.length > 0 ? (
              <img src={profile.photos[0]} alt="Avatar" />
            ) : (
              <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333'}}>
                <User size={60} color="#ccc" />
              </div>
            )}
            {uploadingAvatar && (
               <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <div style={{width: 30, height: 30, border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
               </div>
            )}
          </div>
          <div className="badge-verified">
            <Check size={14} strokeWidth={3} />
          </div>
          <div className="btn-edit-avatar" onClick={() => fileInputRef.current?.click()} style={{cursor: 'pointer'}}>
            <Camera size={16} />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{display: 'none'}} 
            accept="image/*" 
            onChange={handleAvatarUpload} 
          />
        </div>

        <h2 className="premium-profile-name">
          {formData.first_name || 'User'} 
          {!isEditing && (
            <Edit2 
              size={18} 
              color="var(--primary)" 
              style={{cursor: 'pointer'}} 
              onClick={() => setIsEditing(true)} 
            />
          )}
        </h2>
        <div className="online-status">
          <div className="status-dot"></div>
          Online
        </div>

        <div 
          className="completion-container" 
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowCompletionTooltip(true)}
          onMouseLeave={() => setShowCompletionTooltip(false)}
        >
          <div className="completion-header">
            <span>Profile Completion</span>
            <span className="completion-percent">{completionStats.percent}%</span>
          </div>
          <div className="completion-track">
            <div className="completion-fill" style={{ width: `${completionStats.percent}%` }}></div>
          </div>
          
          {showCompletionTooltip && completionStats.missing.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '10px',
              background: 'rgba(28, 28, 30, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '15px',
              width: 'max-content',
              maxWidth: '250px',
              zIndex: 100,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              pointerEvents: 'none'
            }}>
              <div style={{
                position: 'absolute',
                top: '-6px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                width: '12px',
                height: '12px',
                background: 'rgba(28, 28, 30, 0.95)',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }} />
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'white' }}>To reach 100%, add:</h4>
              <ul style={{ margin: 0, padding: '0 0 0 15px', fontSize: '0.85rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {completionStats.missing.map(field => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="premium-section-card">
        <div className="premium-section-header">
          <User className="premium-section-icon" size={20} />
          Basic Information
        </div>
        <div className="premium-form-grid two-cols">
          <div className="premium-input-group" style={{gridColumn: '1 / -1'}}>
            <label className="premium-input-label">Full Name</label>
            <div className="premium-input-wrapper">
              <User size={18} className="premium-input-icon" />
              <input 
                className="premium-input"
                value={formData.first_name}
                onChange={e => setFormData({...formData, first_name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="premium-input-group">
            <label className="premium-input-label">Gender</label>
            <div className="premium-input-wrapper">
              <User size={18} className="premium-input-icon" />
              {isEditing ? (
                <select 
                  className="premium-select"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <input className="premium-input" value={formData.gender} disabled />
              )}
              {isEditing && <ChevronLeft size={16} className="premium-select-arrow" style={{transform: 'rotate(-90deg)'}} />}
            </div>
          </div>

          <div className="premium-input-group">
            <label className="premium-input-label">Age</label>
            <div className="premium-input-wrapper">
              <Calendar size={18} className="premium-input-icon" />
              {isEditing ? (
                <select 
                  className="premium-select"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                >
                  <option value="">Select</option>
                  {Array.from({length: 40}, (_, i) => i + 18).map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              ) : (
                <input className="premium-input" value={formData.age} disabled />
              )}
              {isEditing && <ChevronLeft size={16} className="premium-select-arrow" style={{transform: 'rotate(-90deg)'}} />}
            </div>
          </div>

          <div className="premium-input-group" style={{gridColumn: '1 / -1'}}>
            <label className="premium-input-label">City</label>
            <div className="premium-input-wrapper">
              <MapPin size={18} className="premium-input-icon" />
              <input 
                className="premium-input"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                disabled={!isEditing}
                placeholder="E.g. Bangalore, India"
              />
            </div>
          </div>

          <div className="premium-input-group" style={{gridColumn: '1 / -1'}}>
            <label className="premium-input-label">Profession</label>
            <div className="premium-input-wrapper">
              <Briefcase size={18} className="premium-input-icon" />
              {isEditing ? (
                <select 
                  className="premium-select"
                  value={formData.profession}
                  onChange={e => setFormData({...formData, profession: e.target.value})}
                >
                  <option value="">Select Profession</option>
                  {ALL_PROFESSIONS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              ) : (
                <input className="premium-input" value={formData.profession || 'Not specified'} disabled />
              )}
              {isEditing && <ChevronLeft size={16} className="premium-select-arrow" style={{transform: 'rotate(-90deg)'}} />}
            </div>
          </div>

          <div className="premium-input-group" style={{gridColumn: '1 / -1'}}>
            <label className="premium-input-label">Education</label>
            <div className="premium-input-wrapper">
              <GraduationCap size={18} className="premium-input-icon" />
              {isEditing ? (
                <select 
                  className="premium-select"
                  value={formData.education}
                  onChange={e => setFormData({...formData, education: e.target.value})}
                >
                  <option value="">Select Education</option>
                  {ALL_EDUCATIONS.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              ) : (
                <input className="premium-input" value={formData.education || 'Not specified'} disabled />
              )}
              {isEditing && <ChevronLeft size={16} className="premium-select-arrow" style={{transform: 'rotate(-90deg)'}} />}
            </div>
          </div>
          
          <div className="premium-input-group" style={{gridColumn: '1 / -1'}}>
            <label className="premium-input-label">Languages</label>
            <div className="premium-input-wrapper" style={{height: 'auto', minHeight: '46px', padding: '8px 12px', flexWrap: 'wrap', gap: '8px'}}>
              <Globe size={18} className="premium-input-icon" />
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1, alignItems: 'center'}}>
                {(formData.languages || []).map(lang => (
                  <span key={lang} style={{background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center'}}>
                    {lang}
                    {isEditing && <span style={{marginLeft: '6px', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1}} onClick={() => {
                      setFormData({...formData, languages: formData.languages.filter(l => l !== lang)});
                    }}>×</span>}
                  </span>
                ))}
                {isEditing && (
                  <select 
                    className="premium-select"
                    style={{width: 'auto', flex: 1, minWidth: '120px'}}
                    value=""
                    onChange={e => {
                      if (e.target.value && !formData.languages.includes(e.target.value)) {
                        setFormData({...formData, languages: [...formData.languages, e.target.value]});
                      }
                    }}
                  >
                    <option value="">Add language...</option>
                    {ALL_LANGUAGES.filter(l => !(formData.languages || []).includes(l)).map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                )}
                {!isEditing && (!formData.languages || formData.languages.length === 0) && (
                  <span style={{color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem'}}>Not specified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Me */}
      <div className="premium-section-card">
        <div className="premium-section-header">
          <User className="premium-section-icon" size={20} />
          About Me
        </div>
        <div className={isEditing ? "premium-textarea-wrapper" : "premium-textarea-wrapper-view"}>
          <div className="premium-textarea-inner" style={{background: isEditing ? 'var(--bg-dark)' : 'rgba(255,255,255,0.04)', padding: isEditing ? '12px' : '0'}}>
            <textarea
              className="premium-textarea"
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value.substring(0, 250)})}
              disabled={!isEditing}
              placeholder="Write something about yourself..."
              style={{padding: isEditing ? '0' : '12px'}}
            />
          </div>
        </div>
        {isEditing && (
          <div className="char-counter">
            {formData.bio.length}/250
          </div>
        )}
      </div>

      {/* Interests */}
      <div className="premium-section-card">
        <div className="premium-section-header">
          <Heart className="premium-section-icon" size={20} />
          Interests
        </div>
        <div className="premium-form-grid">
          <div className="premium-input-group">
            <div className="premium-input-wrapper" style={{height: 'auto', minHeight: '46px', padding: '8px 12px', flexWrap: 'wrap', gap: '8px'}}>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1, alignItems: 'center'}}>
                {(formData.interests || []).map(interest => (
                  <span key={interest} style={{background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center'}}>
                    {interest}
                    {isEditing && <span style={{marginLeft: '6px', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1}} onClick={() => {
                      setFormData({...formData, interests: formData.interests.filter(i => i !== interest)});
                    }}>×</span>}
                  </span>
                ))}
                {isEditing && (
                  <select 
                    className="premium-select"
                    style={{width: 'auto', flex: 1, minWidth: '150px'}}
                    value=""
                    onChange={e => {
                      if (e.target.value && !(formData.interests || []).includes(e.target.value)) {
                        setFormData({...formData, interests: [...formData.interests, e.target.value]});
                      }
                    }}
                  >
                    <option value="">Add interest...</option>
                    {ALL_INTERESTS.filter(i => !(formData.interests || []).includes(i)).map(interest => (
                      <option key={interest} value={interest}>{interest}</option>
                    ))}
                  </select>
                )}
                {!isEditing && (!formData.interests || formData.interests.length === 0) && (
                  <span style={{color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem'}}>Not specified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lifestyle */}
      <div className="premium-section-card">
        <div className="premium-section-header">
          <Coffee className="premium-section-icon" size={20} />
          Lifestyle
        </div>
        <div className="premium-form-grid two-cols">
          <div className="premium-input-group">
            <label className="premium-input-label">Smoking</label>
            <div className="premium-input-wrapper">
              <Wind size={18} className="premium-input-icon" />
              {isEditing ? (
                <select className="premium-select" value={formData.smoking} onChange={e => setFormData({...formData, smoking: e.target.value})}>
                  <option value="Non-smoker">Non-smoker</option>
                  <option value="Smoke occasionally">Smoke occasionally</option>
                  <option value="Regular">Regular</option>
                  <option value="Tryin' to quit">Tryin' to quit</option>
                </select>
              ) : (
                <input className="premium-input" value={formData.smoking || 'Not specified'} disabled />
              )}
              {isEditing && <ChevronLeft size={16} className="premium-select-arrow" style={{transform: 'rotate(-90deg)'}} />}
            </div>
          </div>
          
          <div className="premium-input-group">
            <label className="premium-input-label">Drinking</label>
            <div className="premium-input-wrapper">
              <Wine size={18} className="premium-input-icon" />
              {isEditing ? (
                <select className="premium-select" value={formData.drinking} onChange={e => setFormData({...formData, drinking: e.target.value})}>
                  <option value="Non-drinker">Non-drinker</option>
                  <option value="Drink socially only">Drink socially only</option>
                  <option value="Often">Often</option>
                </select>
              ) : (
                <input className="premium-input" value={formData.drinking || 'Not specified'} disabled />
              )}
              {isEditing && <ChevronLeft size={16} className="premium-select-arrow" style={{transform: 'rotate(-90deg)'}} />}
            </div>
          </div>

          <div className="premium-input-group">
            <label className="premium-input-label">Eating</label>
            <div className="premium-input-wrapper">
              <Utensils size={18} className="premium-input-icon" />
              {isEditing ? (
                <select className="premium-select" value={formData.eating} onChange={e => setFormData({...formData, eating: e.target.value})}>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-vegetarian">Non-vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                </select>
              ) : (
                <input className="premium-input" value={formData.eating || 'Not specified'} disabled />
              )}
              {isEditing && <ChevronLeft size={16} className="premium-select-arrow" style={{transform: 'rotate(-90deg)'}} />}
            </div>
          </div>
          
          <div className="premium-input-group">
            <label className="premium-input-label">Zodiac Sign</label>
            <div className="premium-input-wrapper">
              <Sparkles size={18} className="premium-input-icon" />
              {isEditing ? (
                <select className="premium-select" value={formData.zodiac_sign} onChange={e => setFormData({...formData, zodiac_sign: e.target.value})}>
                  <option value="">Select Zodiac Sign</option>
                  {['Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'].map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              ) : (
                <input className="premium-input" value={formData.zodiac_sign || 'Not specified'} disabled />
              )}
              {isEditing && <ChevronLeft size={16} className="premium-select-arrow" style={{transform: 'rotate(-90deg)'}} />}
            </div>
          </div>
        </div>
      </div>

      {/* Looking For */}
      <div className="premium-section-card">
        <div className="premium-section-header">
          <Search className="premium-section-icon" size={20} />
          Looking For
        </div>
        <div className="premium-form-grid">
          <div className="premium-input-group">
            <label className="premium-input-label">Relationship Status</label>
            <div className="premium-input-wrapper">
              <Heart size={18} className="premium-input-icon" />
              {isEditing ? (
                <select className="premium-select" value={formData.relationship_status} onChange={e => setFormData({...formData, relationship_status: e.target.value})}>
                  <option value="">Select Status</option>
                  {ALL_STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <input className="premium-input" value={formData.relationship_status || 'Not specified'} disabled />
              )}
              {isEditing && <ChevronLeft size={16} className="premium-select-arrow" style={{transform: 'rotate(-90deg)'}} />}
            </div>
          </div>

          <div className="premium-input-group">
            <label className="premium-input-label">I'm looking for</label>
            <div className="premium-input-wrapper">
              <Users size={18} className="premium-input-icon" />
              {isEditing ? (
                <select className="premium-select" value={formData.looking_for} onChange={e => setFormData({...formData, looking_for: e.target.value})}>
                  <option value="">Select Goal</option>
                  {ALL_GOALS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              ) : (
                <input className="premium-input" value={formData.looking_for || 'Not specified'} disabled />
              )}
              {isEditing && <ChevronLeft size={16} className="premium-select-arrow" style={{transform: 'rotate(-90deg)'}} />}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <button className="btn-save-bottom" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
          {!saving && <Check size={20} />}
        </button>
      )}
      </>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '320px', background: '#1c1c1e', borderRadius: '20px', padding: '25px', textAlign: 'center', position: 'relative' }}>
            <h3 style={{ margin: '0 0 10px', color: 'white', fontSize: '1.2rem' }}>Log Out</h3>
            <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '25px' }}>Are you sure you want to log out of LoveMitra?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'var(--glass-bg)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isLoggingOut ? <div style={{width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} /> : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
