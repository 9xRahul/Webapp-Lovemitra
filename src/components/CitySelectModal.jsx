import React, { useState, useEffect } from 'react';
import { Search, X, Check, ChevronLeft } from 'lucide-react';
import citiesData from '../assets/indian_cities.json';

const ANYWHERE = "Anywhere in India";

const CitySelectModal = ({ isOpen, onClose, selectedCities, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [tempSelected, setTempSelected] = useState([...selectedCities]);

  useEffect(() => {
    if (isOpen) {
      setTempSelected([...selectedCities]);
      setSearchTerm('');
      setFilteredCities(citiesData);
    }
  }, [isOpen, selectedCities]);

  useEffect(() => {
    const query = searchTerm.toLowerCase();
    const filtered = citiesData.filter(city => {
      const cityName = (city.name || '').toLowerCase();
      const stateName = (city.state || '').toLowerCase();
      return cityName.includes(query) || stateName.includes(query);
    });
    setFilteredCities(filtered);
  }, [searchTerm]);

  const handleToggleCity = (displayString) => {
    let newSelected = [...tempSelected];
    
    if (displayString === ANYWHERE) {
      newSelected = [ANYWHERE];
    } else {
      newSelected = newSelected.filter(c => c !== ANYWHERE);
      if (newSelected.includes(displayString)) {
        newSelected = newSelected.filter(c => c !== displayString);
      } else {
        newSelected.push(displayString);
      }
    }
    setTempSelected(newSelected);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '400px', height: '80vh',
        background: 'var(--surface, #1c1c1e)',
        borderRadius: '25px', position: 'relative',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
            Select cities
          </h2>
          <button className="icon-btn" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '16px' }}>
          <div className="search-input-container" style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.05)'
          }}>
            <input 
              type="text" 
              placeholder="Search city" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--text)',
                fontSize: '1rem'
              }}
            />
            <Search size={20} color="var(--text-secondary)" />
          </div>
        </div>

        {/* Selected Chips */}
        {tempSelected.length > 0 && (
          <div className="no-scrollbar" style={{ padding: '0 16px 8px', display: 'flex', gap: '8px', overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
            {tempSelected.map(city => (
              <div key={city} style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 75, 114, 0.1)',
                color: 'var(--primary)',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                gap: '4px'
              }}>
                {city}
                <X size={14} style={{ cursor: 'pointer' }} onClick={() => handleToggleCity(city)} />
              </div>
            ))}
          </div>
        )}

        {/* City List */}
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 16px', paddingBottom: '80px' }}>
          {/* Always show Anywhere option when not searching */}
          {searchTerm === '' && (
            <div 
              onClick={() => handleToggleCity(ANYWHERE)}
              style={{
                padding: '16px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              <span style={{ 
                fontSize: '1rem', 
                fontWeight: tempSelected.includes(ANYWHERE) ? 600 : 400,
                color: tempSelected.includes(ANYWHERE) ? 'var(--primary)' : 'var(--text)'
              }}>
                {ANYWHERE}
              </span>
              {tempSelected.includes(ANYWHERE) && <Check size={20} color="var(--primary)" />}
            </div>
          )}

          {filteredCities.map((city, idx) => {
            const cityName = city.name || '';
            const stateName = city.state || '';
            const displayString = stateName ? `${cityName}, ${stateName}` : cityName;
            const isSelected = tempSelected.includes(displayString);
            
            return (
              <div 
                key={idx}
                onClick={() => handleToggleCity(displayString)}
                style={{
                  padding: '16px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'var(--primary)' : 'var(--text)'
                }}>
                  {displayString}
                </span>
                {isSelected && <Check size={20} color="var(--primary)" />}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--surface, #1c1c1e)',
          padding: '16px',
          display: 'flex',
          gap: '16px',
          borderTop: '1px solid var(--border)'
        }}>
          <button 
            className="btn-outline" 
            onClick={onClose}
            style={{ flex: 1, padding: '12px', borderRadius: '12px' }}
          >
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={() => onSave(tempSelected)}
            style={{ flex: 1, padding: '12px', borderRadius: '12px' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitySelectModal;
