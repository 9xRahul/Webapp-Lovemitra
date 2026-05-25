import React, { useEffect, useState } from 'react';
import { User, Settings, Image as ImageIcon } from 'lucide-react';
import { auth } from '../firebase';
import { UserService } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ first_name: '', bio: '', city: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await UserService.getMe();
      if (res.data.status === 'success') {
        const u = res.data.data.user;
        setProfile(u);
        setFormData({ first_name: u.first_name || '', bio: u.bio || '', city: u.city || '' });
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
      const res = await UserService.updateMe(formData);
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

  if (loading) return <div className="page-center">Loading Profile...</div>;
  if (!profile) return <div className="page-center">Could not load profile.</div>;

  return (
    <div className="page-container" style={{ overflowY: 'auto', paddingBottom: '2rem' }}>
      <div className="profile-header">
        <h1 className="page-title">Profile</h1>
        <button className="icon-btn"><Settings size={24} /></button>
      </div>

      <div className="glass-card profile-card">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {profile.photos && profile.photos.length > 0 ? (
              <img src={profile.photos[0]} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={60} color="#ccc" />
            )}
          </div>
          <button className="edit-avatar-btn"><ImageIcon size={18} /></button>
        </div>

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '1rem' }}>
            <input 
              className="input-field" 
              placeholder="First Name"
              value={formData.first_name} 
              onChange={e => setFormData({...formData, first_name: e.target.value})} 
            />
            <input 
              className="input-field" 
              placeholder="Bio"
              value={formData.bio} 
              onChange={e => setFormData({...formData, bio: e.target.value})} 
            />
            <input 
              className="input-field" 
              placeholder="City"
              value={formData.city} 
              onChange={e => setFormData({...formData, city: e.target.value})} 
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1 }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn-primary" onClick={() => setIsEditing(false)} style={{ flex: 1, background: 'var(--glass-border)', color: '#fff' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="profile-name">{profile.first_name || 'LoveMitra User'}</h2>
            <p className="profile-email">{profile.email || auth.currentUser?.email}</p>
            {profile.city && <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{profile.city}</p>}
            {profile.bio && <p style={{ margin: '10px 0', fontStyle: 'italic', color: '#ccc' }}>"{profile.bio}"</p>}
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{profile.likesCount || 0}</span>
                <span className="stat-label">Likes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profile.visitorCount || 0}</span>
                <span className="stat-label">Visitors</span>
              </div>
            </div>

            <button className="btn-primary edit-profile-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
