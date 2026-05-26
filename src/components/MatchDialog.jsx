import React from 'react';
import { Heart } from 'lucide-react';

const MatchDialog = ({ isOpen, myProfile, matchedProfile, onSayHello, onKeepMatching }) => {
  if (!isOpen || !myProfile || !matchedProfile) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#121212',
        borderRadius: '30px',
        width: '100%',
        maxWidth: '380px',
        padding: '40px 20px 30px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        
        {/* Heart Icon */}
        <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
          <Heart size={60} fill="#ff1f5a" color="#ff1f5a" style={{ filter: 'drop-shadow(0 0 15px rgba(255, 31, 90, 0.5))' }} />
        </div>

        {/* Text */}
        <h2 style={{ color: 'white', fontSize: '2.2rem', fontWeight: 'bold', margin: '0 0 10px 0', fontFamily: 'sans-serif' }}>
          It's a Match!
        </h2>
        <p style={{ color: '#aaa', fontSize: '1rem', margin: '0 0 40px 0', textAlign: 'center' }}>
          You and {matchedProfile.first_name} liked each other
        </p>

        {/* Overlapping Avatars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '50px', position: 'relative', width: '200px', height: '100px' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid white',
            position: 'absolute', left: 0, zIndex: 1, boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            {myProfile.photos && myProfile.photos.length > 0 ? (
              <img src={myProfile.photos[0]} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {myProfile.first_name?.charAt(0)}
              </div>
            )}
          </div>
          
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid white',
            position: 'absolute', right: 0, zIndex: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            {matchedProfile.photos && matchedProfile.photos.length > 0 ? (
              <img src={matchedProfile.photos[0]} alt={matchedProfile.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {matchedProfile.first_name?.charAt(0)}
              </div>
            )}
          </div>

          {/* Small Heart Badge connecting them */}
          <div style={{
            position: 'absolute', zIndex: 3, background: '#121212', borderRadius: '50%', padding: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white'
          }}>
            <Heart size={20} fill="#ff1f5a" color="#ff1f5a" />
          </div>
        </div>

        {/* Buttons */}
        <button 
          onClick={onSayHello}
          style={{
            width: '100%', padding: '16px', borderRadius: '25px', border: 'none',
            background: 'linear-gradient(90deg, #ff1f5a, #ff8c4b)',
            color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
            marginBottom: '20px', letterSpacing: '0.5px'
          }}
        >
          Say Hello
        </button>

        <button 
          onClick={onKeepMatching}
          style={{
            width: '100%', padding: '15px', borderRadius: '25px', border: 'none',
            background: 'transparent',
            color: '#888', fontSize: '1rem', fontWeight: '500', cursor: 'pointer'
          }}
        >
          Keep Matching
        </button>

      </div>
    </div>
  );
};

export default MatchDialog;
