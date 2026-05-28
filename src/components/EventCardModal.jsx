import React, { useState } from 'react';
import { X } from 'lucide-react';

const EventCardModal = ({ cards, onClose, onMarkViewed }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const handleAction = () => {
    // Mark as viewed for priority 2 cards
    if (currentCard.priority === 2 || currentCard.displayPriority === 2) {
      if (currentCard.id) onMarkViewed(currentCard.id);
    }

    if (currentCard.actionUrl) {
      window.open(currentCard.actionUrl, '_blank');
    }
    
    goToNext();
  };

  const handleClose = () => {
    // Mark as viewed for priority 2 cards
    if (currentCard.priority === 2 || currentCard.displayPriority === 2) {
      if (currentCard.id) onMarkViewed(currentCard.id);
    }
    goToNext();
  };

  const goToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div onClick={handleClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', background: '#1c1c1e', borderRadius: '25px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', zIndex: 10 }}
        >
          <X size={18} />
        </button>

        {/* Card Image */}
        <div style={{ width: '100%', height: '300px', backgroundColor: '#2a2a2c', position: 'relative' }}>
          {currentCard.image || currentCard.imageUrl ? (
            <img src={currentCard.image || currentCard.imageUrl} alt={currentCard.cardTitle || currentCard.title || 'Event'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff4b82, #ff8c4b)', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', padding: '20px', textAlign: 'center' }}>
              {currentCard.cardTitle || currentCard.title || 'Special Event!'}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px 0', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {currentCard.cardTitle || currentCard.title || 'Special Promotion!'}
          </h2>
          
          {currentCard.description && (
            <p style={{ color: '#ccc', fontSize: '1rem', lineHeight: '1.5', margin: '0 0 25px 0' }}>
              {currentCard.description}
            </p>
          )}
          
          {cards.length > 1 && (
            <div style={{ marginTop: '15px', display: 'flex', gap: '6px' }}>
              {cards.map((_, idx) => (
                <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === currentIndex ? '#ff4b82' : 'rgba(255,255,255,0.2)' }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCardModal;
