import React from 'react';

export const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = { sm: '20px', md: '40px', lg: '60px' };
  const spinner = <div className="spinner" style={{ width: sizes[size], height: sizes[size] }} />;
  if (fullScreen) return <div className="spinner-fullscreen">{spinner}</div>;
  return spinner;
};

export const StarRating = ({ rating = 0, reviews = 0, interactive = false, onRate }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star}
          onClick={() => interactive && onRate && onRate(star)}
          style={{ cursor: interactive ? 'pointer' : 'default', color: rating >= star ? '#f59e0b' : '#d1d5db', fontSize: '16px' }}>
          ★
        </span>
      ))}
      {reviews > 0 && <span className="review-count">({reviews})</span>}
    </div>
  );
};

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>‹ Prev</button>
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i).map(p => (
        <button key={p} onClick={() => onPageChange(p)} className={p === currentPage ? 'active' : ''}>{p + 1}</button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>Next ›</button>
    </div>
  );
};

export default LoadingSpinner;
