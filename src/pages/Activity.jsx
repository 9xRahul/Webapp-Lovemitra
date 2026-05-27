import React, { useEffect, useState } from 'react';
import { MatchingService, ChatService, UserService } from '../services/api';
import ProfileDetailModal from '../components/ProfileDetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Snackbar from '../components/Snackbar';
import MatchDialog from '../components/MatchDialog';
import { X } from 'lucide-react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Activity = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('likes');
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [interactedProfiles, setInteractedProfiles] = useState({});

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Match Dialog State
  const [myProfile, setMyProfile] = useState(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [matchData, setMatchData] = useState(null);

  // Snackbar State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Message Request Modal State
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [targetUidForMsg, setTargetUidForMsg] = useState(null);
  const [dailyRequestCount, setDailyRequestCount] = useState(0);

  const openProfileDetail = (profile) => {
    setSelectedProfile(profile);
    setProfileModalOpen(true);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserAndRelationships = async () => {
      if (!auth.currentUser) return;
      try {
        const [userRes, relRes] = await Promise.all([
          UserService.getMe(),
          MatchingService.getRelationshipIds()
        ]);
        
        if (!isMounted) return;

        if (userRes.data.status === 'success') {
          setDailyRequestCount(userRes.data.data.user.dailyRequestCount);
          setMyProfile(userRes.data.data.user);
        }

        if (relRes.data.status === 'success') {
          const { liked, skipped, contacted, matched } = relRes.data.data;
          const interactionsMap = {};
          
          if (liked) liked.forEach(id => interactionsMap[id] = 'liked');
          if (skipped) skipped.forEach(id => interactionsMap[id] = 'skipped');
          if (matched) matched.forEach(id => interactionsMap[id] = 'messaged'); 
          if (contacted) contacted.forEach(id => interactionsMap[id] = 'messaged');

          setInteractedProfiles(prev => ({ ...prev, ...interactionsMap }));
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (activeTab === 'likes') {
          res = await MatchingService.getReceivedLikes();
        } else {
          res = await MatchingService.getReceivedViews();
        }

        if (!isMounted) return;

        if (res.data.status === 'success') {
          if (activeTab === 'likes') {
            setData(res.data.data.users || []);
          } else {
            const visits = res.data.data.visits || [];
            setData(visits.map(v => v.user).filter(Boolean));
          }
        }
      } catch (err) {
        console.error(`Failed to load ${activeTab}`, err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserAndRelationships();
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const handleLike = async (uid) => {
    try {
      const res = await MatchingService.likeUser(uid);
      if (res.data.isMatch && res.data.data) {
        setMatchData(res.data.data.match);
        setMatchedUser(res.data.data.matchedUser);
        setMatchDialogOpen(true);
      }
      setInteractedProfiles(prev => ({ ...prev, [uid]: 'liked' }));
    } catch (err) {
      console.error('Failed to like user', err);
    }
  };

  const handleNope = async (uid) => {
    try {
      await MatchingService.skipUser(uid);
      setInteractedProfiles(prev => ({ ...prev, [uid]: 'skipped' }));
    } catch (err) {
      console.error('Failed to skip user', err);
    }
  };

  const openMessageModal = async (uid) => {
    if (interactedProfiles[uid] === 'messaged') {
      setSnackbarMessage("Wait till that particular user replies to your message");
      setSnackbarOpen(true);
      return;
    }

    setTargetUidForMsg(uid);
    setMessageModalOpen(true);
    try {
      const res = await UserService.getMe();
      if (res.data.status === 'success') {
        setDailyRequestCount(res.data.data.user.dailyRequestCount || 0);
      }
    } catch (err) {
      console.error("Failed to refresh daily request count", err);
    }
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
      
      setInteractedProfiles(prev => ({ ...prev, [targetUidForMsg]: 'messaged' }));
      setMessageModalOpen(false);
      setMessageText('');
    } catch (err) {
      console.error("Failed to send message request", err);
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: 0 }}>
      <div style={{ position: 'sticky', top: 0, background: 'var(--bg-dark)', zIndex: 10, padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: '1rem' }}>Activity</h1>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
          {['likes', 'visitors'].map(tab => (
          <button 
            key={tab}
            onClick={() => {
              if (activeTab !== tab) {
                setLoading(true);
                setData([]);
                setVisibleCount(10);
                setActiveTab(tab);
              }
            }}
            style={{ 
              flex: 1,
              padding: '10px 16px', 
              borderRadius: '20px', 
              border: 'none', 
              background: activeTab === tab ? 'var(--primary)' : 'var(--glass-bg)',
              color: activeTab === tab ? '#fff' : 'inherit',
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      </div>

      <div style={{ padding: '0.5rem 1.5rem 1.5rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '60vh'}}>
            <LoadingSpinner text={`Loading ${activeTab}...`} />
          </div>
        ) : data.length === 0 ? (
          <div className="gradient-text" style={{ margin: 'auto' }}>No {activeTab} yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {data.slice(0, visibleCount).map((user, idx) => (
                <div 
                  key={idx} 
                  className="glass-card" 
                  style={{ padding: '0', overflow: 'hidden', borderRadius: '16px', cursor: 'pointer' }}
                  onClick={() => openProfileDetail(user)}
                >
                  <div style={{ height: '150px', background: '#e0e0e0', position: 'relative' }}>
                    {user.photos && user.photos.length > 0 ? (
                      <img src={user.photos[0]} alt={user.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="gradient-text">{user.first_name}</span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', color: 'white', padding: '12px 10px 10px' }}>
                      <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '3px' }}>{user.first_name}, {user.age || 25}</div>
                      <div style={{ fontSize: '0.75rem', color: '#ccc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📍 {user.city || 'Location Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {visibleCount < data.length && (
              <button 
                onClick={() => setVisibleCount(prev => prev + 10)}
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-dark)',
                  padding: '12px 24px',
                  borderRadius: '24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  margin: '0 auto',
                  display: 'block'
                }}
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>

      <ProfileDetailModal 
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={selectedProfile}
        interactionState={selectedProfile ? interactedProfiles[selectedProfile.uid] : null}
        onLike={() => { setProfileModalOpen(false); handleLike(selectedProfile?.uid); }}
        onNope={() => { setProfileModalOpen(false); handleNope(selectedProfile?.uid); }}
        onMessage={() => { setProfileModalOpen(false); openMessageModal(selectedProfile?.uid); }}
      />

      {/* Message Request Modal */}
      {messageModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: '#1c1c1e', borderRadius: '25px', padding: '25px', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            
            <button 
              onClick={() => setMessageModalOpen(false)} 
              style={{ position: 'absolute', top: '-15px', right: '-15px', background: '#000', border: '1.5px solid white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {(() => {
              const profile = data.find(m => m.uid === targetUidForMsg) || selectedProfile;
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

      <Snackbar 
        isOpen={snackbarOpen} 
        message={snackbarMessage} 
        onClose={() => setSnackbarOpen(false)} 
      />

      <MatchDialog
        isOpen={matchDialogOpen}
        myProfile={myProfile}
        matchedProfile={matchedUser}
        onKeepMatching={() => {
          setMatchDialogOpen(false);
          navigate('/dashboard');
        }}
        onSayHello={() => {
          setMatchDialogOpen(false);
          navigate(`/chat/${matchData.chatId}`, { state: { otherUser: matchedUser }, replace: true });
        }}
      />
    </div>
  );
};

export default Activity;
