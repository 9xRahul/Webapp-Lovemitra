import React, { useEffect, useState } from 'react';
import { MatchingService } from '../services/api';

const Activity = () => {
  const [activeTab, setActiveTab] = useState('likes');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === 'likes') {
        res = await MatchingService.getReceivedLikes();
      } else {
        res = await MatchingService.getReceivedViews();
      }
      if (res.data.status === 'success') {
        setData(res.data.data.users || []);
      }
    } catch (err) {
      console.error(`Failed to load ${activeTab}`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h1 className="page-title" style={{ marginBottom: '1rem' }}>Activity</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
        {['likes', 'visitors'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
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

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div className="gradient-text">Loading {activeTab}...</div>
        ) : data.length === 0 ? (
          <div className="gradient-text">No {activeTab} yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {data.map((user, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '16px' }}>
                <div style={{ height: '150px', background: '#e0e0e0', position: 'relative' }}>
                  {user.photos && user.photos.length > 0 ? (
                    <img src={user.photos[0]} alt={user.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="gradient-text">{user.first_name}</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white', padding: '10px' }}>
                    <div style={{ fontWeight: 600 }}>{user.first_name}, {user.age || 25}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
