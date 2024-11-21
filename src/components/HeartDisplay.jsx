import React from 'react';

const HeartDisplay = ({ value }) => {
  return (
    <div>
      {[...Array(10)].map((_, i) => (
        <span key={i} style={{ color: i < value ? 'red' : 'grey', fontSize: '24px', padding: '2px' }}>
          ♥
        </span>
      ))}
    </div>
  );
};

export default HeartDisplay;
