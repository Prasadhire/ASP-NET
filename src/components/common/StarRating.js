import React from 'react';
import './StarRating.css';

function StarRating({ value, onChange, readOnly }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map(star => (
        <span
          key={star}
          className={`star ${value >= star ? 'filled' : ''} ${readOnly ? 'readonly' : ''}`}
          onClick={() => !readOnly && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
