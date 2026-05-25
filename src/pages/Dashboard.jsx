import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MatchingService, ChatService, UserService } from '../services/api';
import { Search, X, Heart, MessageCircle, BadgeCheck, Briefcase, GraduationCap, Sparkles, Cigarette, Wine, Utensils, Languages, Camera, Smartphone, Mail, Share, AlertTriangle, CheckCircle2 } from 'lucide-react';
import TinderCard from 'react-tinder-card';
import { auth } from '../firebase';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const currentIndexRef = useRef(currentIndex);
  
  const [loading, setLoading] = useState(true);

  // Message Request Modal State
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [targetUidForMsg, setTargetUidForMsg] = useState(null);
  const [dailyRequestCount, setDailyRequestCount] = useState(0);

  // Profile Detail Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Refs for programmatic swiping
  const cardRefs = useMemo(() => Array(100).fill(0).map(() => React.createRef()), []);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await UserService.getMe();
        if (res.data.status === 'success') {
          setDailyRequestCount(res.data.data.user.dailyRequestCount);
        }
      } catch (err) {
        console.error("Failed to load user info", err);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUser();
        fetchMatches();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await MatchingService.getPotentialMatches();
      if (res.data.status === 'success') {
        // We reverse so that the highest priority match is at the END of the array (rendered last, visually on top)
        const loadedUsers = (res.data.data.users || []).reverse();
        setMatches(loadedUsers);
        updateCurrentIndex(loadedUsers.length - 1);
      }
    } catch (err) {
      console.error("Failed to load matches", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (dir, uid, index) => {
    // Decrement index immediately when swipe starts!
    updateCurrentIndex(index - 1);
    try {
      if (dir === 'right') {
        await MatchingService.likeUser(uid);
      } else if (dir === 'left') {
        await MatchingService.skipUser(uid);
      }
    } catch (err) {
      console.error(`Failed to swipe ${dir} user`, err);
    }
  };

  const onCardLeftScreen = (uid, index) => {
    // If the card leaves the screen, we ensure it doesn't snap back.
    // In rare cases where currentIndex got out of sync, we restore it, 
    // but typically we do nothing here since handleSwipe already decremented.
  };

  const swipeButton = async (dir) => {
    const activeIndex = currentIndexRef.current;
    if (activeIndex >= 0 && activeIndex < matches.length) {
      // Programmatically trigger the swipe on the current top card
      if (cardRefs[activeIndex] && cardRefs[activeIndex].current) {
        await cardRefs[activeIndex].current.swipe(dir);
      }
    }
  };

  const openMessageModal = (uid) => {
    setTargetUidForMsg(uid);
    setMessageModalOpen(true);
  };

  const handleMessageRequest = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !targetUidForMsg || dailyRequestCount >= 20) return;

    setSendingMsg(true);
    try {
      const myUid = auth.currentUser?.uid;
      const chatId = [myUid, targetUidForMsg].sort().join('_');
      const res = await ChatService.sendMessage({
        chatId,
        receiverId: targetUidForMsg,
        content: messageText,
        type: 'text'
      });
      
      if (res.data.status === 'success' && res.data.data.dailyRequestCount !== undefined) {
        setDailyRequestCount(res.data.data.dailyRequestCount);
      }
      
      // Explicitly find the card for the user we just messaged
      const exactIndex = matches.findIndex(m => m.uid === targetUidForMsg);
      
      if (exactIndex !== -1 && cardRefs[exactIndex] && cardRefs[exactIndex].current) {
        // Fire and forget the swipe immediately
        cardRefs[exactIndex].current.swipe('right');
      }

      setMessageModalOpen(false);
      setMessageText('');
    } catch (err) {
      console.error("Failed to send message request", err);
    } finally {
      setSendingMsg(false);
    }
  };

  const openProfileDetail = (profile) => {
    setSelectedProfile(profile);
    setProfileModalOpen(true);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', zIndex: 10 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Discover</h1>
        <button className="icon-btn"><Search size={24} /></button>
      </div>

      <div className="swipe-card-container" style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {loading ? (
          <LoadingSpinner text="Finding Matches..." />
        ) : matches.length === 0 || currentIndex < 0 ? (
          <div className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>No more matches found in this area.</div>
        ) : (
          matches.map((match, index) => (
            <TinderCard
              ref={cardRefs[index]}
              key={match.uid}
              onSwipe={(dir) => handleSwipe(dir, match.uid, index)}
              onCardLeftScreen={() => onCardLeftScreen(match.uid, index)}
              preventSwipe={['up', 'down']}
              className="tinder-card"
              style={{ position: 'absolute', width: '100%', maxWidth: '400px', height: '100%' }}
            >
              <div 
                className="glass-card main-swipe-card" 
                style={{ width: '100%', height: '100%', cursor: 'pointer', overflow: 'hidden', padding: 0, position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={() => openProfileDetail(match)}
              >
                <div className="card-image-placeholder" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                  {match.photos && match.photos.length > 0 ? (
                    <img src={match.photos[0]} alt={match.first_name} style={{width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none'}} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{match.first_name}</span>
                    </div>
                  )}
                </div>
                
                {/* Overlay Info */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '25px', background: 'linear-gradient(transparent, rgba(0,0,0,0.95))', zIndex: 2, pointerEvents: 'none', color: 'white' }}>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {match.first_name}, {match.age || 25}
                    {match.isPhotoVerified && <BadgeCheck size={24} color="#ffffff" fill="#1DA1F2" style={{ marginTop: '4px' }} />}
                  </h2>
                  <p style={{ fontSize: '1rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>📍 {match.city || 'Location Unknown'}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    {match.relationshipStatus && (
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', backdropFilter: 'blur(4px)' }}>
                        {match.relationshipStatus}
                      </span>
                    )}
                    {(match.lookingFor || match.bio) && (
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', backdropFilter: 'blur(4px)' }}>
                        Looking for: {match.lookingFor || 'A connection'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </TinderCard>
          ))
        )}
      </div>

      {/* Stationary Action Buttons */}
      {matches.length > 0 && currentIndex >= 0 && !loading && (
        <div className="card-actions" style={{ display: 'flex', justifyContent: 'center', gap: '25px', zIndex: 1000, background: 'transparent', padding: '15px 0 5px 0' }}>
          <button className="action-btn nope" onClick={() => swipeButton('left')} style={{ width: '65px', height: '65px', color: '#ff4b4b', boxShadow: '0 10px 25px rgba(255, 75, 75, 0.2)', border: '1px solid rgba(255, 75, 75, 0.1)' }}>
            <X size={32} strokeWidth={3} />
          </button>
          <button className="action-btn message" onClick={() => openMessageModal(matches[currentIndex]?.uid)} style={{ width: '50px', height: '50px', color: '#4b9fff', boxShadow: '0 10px 25px rgba(75, 159, 255, 0.2)', border: '1px solid rgba(75, 159, 255, 0.1)', marginTop: '10px' }}>
            <MessageCircle size={24} strokeWidth={2.5} />
          </button>
          <button className="action-btn like" onClick={() => swipeButton('right')} style={{ width: '65px', height: '65px', color: '#4bff94', boxShadow: '0 10px 25px rgba(75, 255, 148, 0.2)', border: '1px solid rgba(75, 255, 148, 0.1)' }}>
            <Heart size={32} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Message Request Modal */}
      {messageModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: '#1c1c1e', borderRadius: '25px', padding: '25px', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            
            {/* Close Button Floating */}
            <button 
              onClick={() => setMessageModalOpen(false)} 
              style={{ position: 'absolute', top: '-15px', right: '-15px', background: '#000', border: '1.5px solid white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {(() => {
              const profile = matches.find(m => m && m.uid === targetUidForMsg) || selectedProfile;
              if (!profile) return null;
              
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    {profile?.photos?.length > 0 ? (
                      <img src={profile.photos[0]} alt={profile.first_name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        {profile?.first_name ? profile.first_name.charAt(0) : '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem', fontWeight: '600' }}>Send message to {profile?.first_name || 'User'}</h3>
                    <div style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(255, 75, 130, 0.08)', border: '1px solid rgba(255, 75, 130, 0.2)', borderRadius: '15px', color: '#ff4b82', fontSize: '0.75rem', marginTop: '6px' }}>
                      {20 - dailyRequestCount > 0 ? `${20 - dailyRequestCount} messages left today` : 'No messages left today'}
                    </div>
                  </div>
                </div>
              );
            })()}

            <form onSubmit={handleMessageRequest} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <textarea 
                autoFocus
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Type your message"
                style={{ background: '#252528', border: '1px solid #333', color: 'white', borderRadius: '15px', padding: '15px', fontSize: '1rem', minHeight: '130px', resize: 'none', outline: 'none' }}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 75, 75, 0.08)', padding: '14px 15px', borderRadius: '12px', color: '#ff4b4b' }}>
                <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>!</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Don't share no, Telegram, IG, Snap</span>
              </div>

              <button 
                type="submit" 
                disabled={!messageText.trim() || sendingMsg || dailyRequestCount >= 20}
                style={{ background: 'linear-gradient(90deg, #ff4b82, #ff8c4b)', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '1rem', letterSpacing: '1px', fontWeight: 'bold', cursor: (!messageText.trim() || sendingMsg || dailyRequestCount >= 20) ? 'not-allowed' : 'pointer', opacity: (!messageText.trim() || sendingMsg || dailyRequestCount >= 20) ? 0.7 : 1, marginTop: '5px', transition: 'transform 0.1s' }}
              >
                {dailyRequestCount >= 20 ? 'LIMIT REACHED' : sendingMsg ? 'SENDING...' : 'SEND'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Detail Modal */}
      {profileModalOpen && selectedProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="no-scrollbar" style={{ background: '#121212', width: '100%', maxWidth: '420px', height: '85vh', maxHeight: '900px', borderRadius: '25px', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            <button style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '8px', color: 'white', zIndex: 10000, cursor: 'pointer', backdropFilter: 'blur(5px)' }} onClick={() => setProfileModalOpen(false)}>
              <X size={20} />
            </button>
            
            <div style={{ width: '100%', height: '45%', minHeight: '300px', flexShrink: 0, position: 'relative' }}>
              {selectedProfile.photos && selectedProfile.photos.length > 0 ? (
                <img src={selectedProfile.photos[0]} alt={selectedProfile.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', color: 'white' }}>
                  {selectedProfile.first_name}
                </div>
              )}
            </div>
            
            <div style={{ flex: 1, padding: '20px 25px 25px 25px', color: 'white', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {selectedProfile.first_name}, {selectedProfile.age || 25}
                {selectedProfile.isPhotoVerified && <BadgeCheck size={28} color="#ffffff" fill="#1DA1F2" style={{ marginTop: '4px' }} />}
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '20px' }}>📍 {selectedProfile.city || 'Location Unknown'}</p>

              {/* Interaction Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '30px' }}>
                <button className="action-btn nope" onClick={() => { setProfileModalOpen(false); swipeButton('left'); }} style={{ width: '60px', height: '60px', color: '#ff4b4b', boxShadow: '0 10px 25px rgba(255, 75, 75, 0.2)', border: '1px solid rgba(255, 75, 75, 0.1)' }}>
                  <X size={32} strokeWidth={3} />
                </button>
                <button className="action-btn message" onClick={() => { setProfileModalOpen(false); openMessageModal(selectedProfile.uid); }} style={{ width: '50px', height: '50px', color: '#4b9fff', boxShadow: '0 10px 25px rgba(75, 159, 255, 0.2)', border: '1px solid rgba(75, 159, 255, 0.1)', marginTop: '5px' }}>
                  <MessageCircle size={24} strokeWidth={2.5} />
                </button>
                <button className="action-btn like" onClick={() => { setProfileModalOpen(false); swipeButton('right'); }} style={{ width: '60px', height: '60px', color: '#4bff94', boxShadow: '0 10px 25px rgba(75, 255, 148, 0.2)', border: '1px solid rgba(75, 255, 148, 0.1)' }}>
                  <Heart size={32} strokeWidth={3} />
                </button>
              </div>

            {/* About Me */}
            {selectedProfile.bio && (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ marginBottom: '10px', color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>About Me</h3>
                <p style={{ lineHeight: '1.6', color: '#ccc' }}>{selectedProfile.bio}</p>
              </div>
            )}

            {/* Discovery Details */}
            <h3 style={{ marginBottom: '15px', color: 'white', fontSize: '1.3rem', fontWeight: '600' }}>Discovery Details</h3>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {selectedProfile.profession && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={20} color="#ff4b82" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Profession</div>
                    <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{selectedProfile.profession}</div>
                  </div>
                </div>
              )}
              {selectedProfile.education && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={20} color="#ff4b82" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Education</div>
                    <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{selectedProfile.education}</div>
                  </div>
                </div>
              )}
              {selectedProfile.relationshipStatus && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Heart size={20} color="#ff4b82" fill="#ff4b82" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Relationship</div>
                    <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{selectedProfile.relationshipStatus}</div>
                  </div>
                </div>
              )}
              {selectedProfile.zodiacSign && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={20} color="#ff4b82" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Zodiac Sign</div>
                    <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{selectedProfile.zodiacSign}</div>
                  </div>
                </div>
              )}
              
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />
              
              {selectedProfile.smoking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Cigarette size={20} color="#ff4b82" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Smoking</div>
                    <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{selectedProfile.smoking}</div>
                  </div>
                </div>
              )}
              {selectedProfile.drinking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wine size={20} color="#ff4b82" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Drinking</div>
                    <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{selectedProfile.drinking}</div>
                  </div>
                </div>
              )}
              {selectedProfile.eating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Utensils size={20} color="#ff4b82" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Eating</div>
                    <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{selectedProfile.eating}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Interests */}
            {selectedProfile.interests && selectedProfile.interests.length > 0 && (
              <>
                <h3 style={{ marginBottom: '15px', color: 'white', fontSize: '1.3rem', fontWeight: '600' }}>Interests</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                  {selectedProfile.interests.map(interest => (
                    <span key={interest} style={{ padding: '8px 18px', border: '1px solid #444', borderRadius: '25px', color: '#ddd', fontSize: '0.95rem' }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Languages */}
            {selectedProfile.languages && selectedProfile.languages.length > 0 && (
              <>
                <h3 style={{ marginBottom: '15px', color: 'white', fontSize: '1.3rem', fontWeight: '600' }}>Languages</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                  {selectedProfile.languages.map(language => (
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
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: selectedProfile.isPhotoVerified ? 'rgba(75, 255, 148, 0.15)' : 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Camera size={20} color={selectedProfile.isPhotoVerified ? '#4bff94' : '#888'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Photo</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{selectedProfile.isPhotoVerified ? 'Verified' : 'Not Verified'}</div>
                </div>
                {selectedProfile.isPhotoVerified && <CheckCircle2 size={24} color="#4bff94" />}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: selectedProfile.isMobileVerified ? 'rgba(75, 255, 148, 0.15)' : 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Smartphone size={20} color={selectedProfile.isMobileVerified ? '#4bff94' : '#888'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Mobile Number</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{selectedProfile.isMobileVerified ? 'Verified' : 'Not Verified'}</div>
                </div>
                {selectedProfile.isMobileVerified && <CheckCircle2 size={24} color="#4bff94" />}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: selectedProfile.isEmailVerified ? 'rgba(75, 255, 148, 0.15)' : 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={20} color={selectedProfile.isEmailVerified ? '#4bff94' : '#888'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Email</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: 'white' }}>{selectedProfile.isEmailVerified ? 'Verified' : 'Not Verified'}</div>
                </div>
                {selectedProfile.isEmailVerified && <CheckCircle2 size={24} color="#4bff94" />}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', paddingBottom: '30px', marginTop: '20px' }}>
              <button style={{ background: 'transparent', border: 'none', color: '#ccc', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '500', padding: '10px' }}>
                <Share size={20} /> FORWARD TO A FRIEND
              </button>
              
              <button style={{ background: 'transparent', border: 'none', color: '#ff4b4b', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '500', padding: '10px' }}>
                <AlertTriangle size={20} /> BLOCK OR REPORT USER
              </button>
            </div>
            
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Dashboard;
