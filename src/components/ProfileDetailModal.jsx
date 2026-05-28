import React, { useState } from 'react';
import { X, BadgeCheck, MessageCircle, Heart, Briefcase, GraduationCap, Sparkles, Cigarette, Wine, Utensils, Languages, Camera, Smartphone, Mail, Share, AlertTriangle, CheckCircle2, ShieldBan } from 'lucide-react';
import { MatchingService } from '../services/api';
import ConfirmActionModal from './ConfirmActionModal';
import ReportUserModal from './ReportUserModal';

const ProfileDetailModal = ({ isOpen, onClose, profile, onNope, onLike, onMessage, interactionState }) => {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !profile) return null;

  const handleBlock = async () => {
    setIsProcessing(true);
    try {
      await MatchingService.blockUser(profile.uid);
      setShowBlockConfirm(false);
      onClose();
      // Optionally trigger a refresh or toast here
    } catch (err) {
      console.error('Failed to block user', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReport = async (reportData) => {
    setIsProcessing(true);
    try {
      await MatchingService.reportUser({
        targetUid: profile.uid,
        ...reportData
      });
      setShowReportModal(false);
      onClose();
    } catch (err) {
      console.error('Failed to report user', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="no-scrollbar" style={{ background: '#121212', width: '100%', maxWidth: '420px', height: '85vh', maxHeight: '900px', borderRadius: '25px', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        <button style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '8px', color: 'white', zIndex: 10000, cursor: 'pointer', backdropFilter: 'blur(5px)' }} onClick={onClose}>
          <X size={20} />
        </button>
        
        <div style={{ width: '100%', height: '45%', minHeight: '300px', flexShrink: 0, position: 'relative' }}>
          {profile.photos && profile.photos.length > 0 ? (
            <img src={profile.photos[0]} alt={profile.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', color: 'white' }}>
              {profile.first_name}
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, padding: '20px 25px 25px 25px', color: 'white', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {profile.first_name}, {profile.age || 25}
            {profile.isPhotoVerified && <BadgeCheck size={28} color="#ffffff" fill="#1DA1F2" style={{ marginTop: '4px' }} />}
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '20px' }}>📍 {profile.city || 'Location Unknown'}</p>

          {/* Interaction Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '30px' }}>
            {onNope && (!interactionState || interactionState === 'none') && (
              <button className="action-btn nope" onClick={() => { onClose(); onNope(); }} style={{ width: '60px', height: '60px', color: '#ff4b4b', boxShadow: '0 10px 25px rgba(255, 75, 75, 0.2)', border: '1px solid rgba(255, 75, 75, 0.1)' }}>
                <X size={32} strokeWidth={3} />
              </button>
            )}
            {onMessage && (
              <button className="action-btn message" onClick={() => { onClose(); onMessage(profile.uid); }} style={{ width: '50px', height: '50px', color: '#4b9fff', boxShadow: '0 10px 25px rgba(75, 159, 255, 0.2)', border: '1px solid rgba(75, 159, 255, 0.1)', marginTop: '5px' }}>
                <MessageCircle size={24} strokeWidth={2.5} />
              </button>
            )}
            {onLike && (!interactionState || interactionState === 'none') && (
              <button className="action-btn like" onClick={() => { onClose(); onLike(); }} style={{ width: '60px', height: '60px', color: '#4bff94', boxShadow: '0 10px 25px rgba(75, 255, 148, 0.2)', border: '1px solid rgba(75, 255, 148, 0.1)' }}>
                <Heart size={32} strokeWidth={3} />
              </button>
            )}
          </div>

          {/* About Me */}
          {profile.bio && (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ marginBottom: '10px', color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>About Me</h3>
              <p style={{ lineHeight: '1.6', color: '#ccc' }}>{profile.bio}</p>
            </div>
          )}

          {/* Discovery Details */}
          <h3 style={{ marginBottom: '15px', color: 'white', fontSize: '1.3rem', fontWeight: '600' }}>Discovery Details</h3>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {profile.profession && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={20} color="#ff4b82" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Profession</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{profile.profession}</div>
                </div>
              </div>
            )}
            {profile.education && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={20} color="#ff4b82" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Education</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{profile.education}</div>
                </div>
              </div>
            )}
            {profile.relationshipStatus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={20} color="#ff4b82" fill="#ff4b82" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Relationship</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{profile.relationshipStatus}</div>
                </div>
              </div>
            )}
            {profile.zodiacSign && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} color="#ff4b82" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Zodiac Sign</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{profile.zodiacSign}</div>
                </div>
              </div>
            )}
            
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />
            
            {profile.smoking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cigarette size={20} color="#ff4b82" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Smoking</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{profile.smoking}</div>
                </div>
              </div>
            )}
            {profile.drinking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wine size={20} color="#ff4b82" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Drinking</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{profile.drinking}</div>
                </div>
              </div>
            )}
            {profile.eating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Utensils size={20} color="#ff4b82" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Eating</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{profile.eating}</div>
                </div>
              </div>
            )}
          </div>

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <>
              <h3 style={{ marginBottom: '15px', color: 'white', fontSize: '1.3rem', fontWeight: '600' }}>Interests</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                {profile.interests.map(interest => (
                  <span key={interest} style={{ padding: '8px 18px', border: '1px solid #444', borderRadius: '25px', color: '#ddd', fontSize: '0.95rem' }}>
                    {interest}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <>
              <h3 style={{ marginBottom: '15px', color: 'white', fontSize: '1.3rem', fontWeight: '600' }}>Languages</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                {profile.languages.map(language => (
                  <span key={language} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px', background: 'rgba(255, 75, 130, 0.1)', border: '1px solid rgba(255, 75, 130, 0.2)', borderRadius: '10px', color: '#ff4b82', fontSize: '0.95rem' }}>
                    <Languages size={16} /> {language}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Verification */}
          <h3 style={{ marginBottom: '15px', color: 'white', fontSize: '1.3rem', fontWeight: '600' }}>Verification</h3>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: profile.isPhotoVerified ? 'rgba(75, 255, 148, 0.15)' : 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Camera size={20} color={profile.isPhotoVerified ? '#4bff94' : '#888'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Photo</div>
                <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{profile.isPhotoVerified ? 'Verified' : 'Not Verified'}</div>
              </div>
              {profile.isPhotoVerified && <CheckCircle2 size={24} color="#4bff94" />}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: profile.isMobileVerified ? 'rgba(75, 255, 148, 0.15)' : 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Smartphone size={20} color={profile.isMobileVerified ? '#4bff94' : '#888'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Mobile Number</div>
                <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{profile.isMobileVerified ? 'Verified' : 'Not Verified'}</div>
              </div>
              {profile.isMobileVerified && <CheckCircle2 size={24} color="#4bff94" />}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: profile.isEmailVerified ? 'rgba(75, 255, 148, 0.15)' : 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={20} color={profile.isEmailVerified ? '#4bff94' : '#888'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Email</div>
                <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{profile.isEmailVerified ? 'Verified' : 'Not Verified'}</div>
              </div>
              {profile.isEmailVerified && <CheckCircle2 size={24} color="#4bff94" />}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', paddingBottom: '30px', marginTop: '20px' }}>
            <button style={{ background: 'transparent', border: 'none', color: '#ccc', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '500', padding: '10px' }}>
              <Share size={20} /> FORWARD TO A FRIEND
            </button>
            
            <div style={{ display: 'flex', gap: '20px' }}>
              <button onClick={() => setShowBlockConfirm(true)} style={{ background: 'transparent', border: 'none', color: '#ff4b4b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '500', padding: '10px' }}>
                <ShieldBan size={18} /> BLOCK USER
              </button>
              
              <button onClick={() => setShowReportModal(true)} style={{ background: 'transparent', border: 'none', color: '#ff4b4b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '500', padding: '10px' }}>
                <AlertTriangle size={18} /> REPORT USER
              </button>
            </div>
          </div>
          
        </div>
      </div>

      <ConfirmActionModal 
        isOpen={showBlockConfirm}
        onClose={() => setShowBlockConfirm(false)}
        onConfirm={handleBlock}
        title={`Block ${profile.first_name}?`}
        message="They won't be able to find your profile, see your posts, or message you. This action is irreversible."
        confirmText="Block"
        isLoading={isProcessing}
      />

      <ReportUserModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onReport={handleReport}
        targetName={profile.first_name}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default ProfileDetailModal;
