import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className={`spinner ${size}`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{text}</span>
        </div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;