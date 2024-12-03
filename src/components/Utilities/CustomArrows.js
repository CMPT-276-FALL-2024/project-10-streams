import React from 'react';

// Custom arrow components
// NextArrow component
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    
    <div
      className={className}
      style={{ 
        ...style, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: 'purple', 
        borderRadius: '50%', 
        padding: '15px', 
        width: '40px', 
        height: '40px',
        zIndex: 10
      }}
      onClick={onClick}
    >
    </div>
  );
};
// PrevArrow component
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: 'purple', 
        borderRadius: '50%', 
        padding: '15px', 
        width: '40px', 
        height: '40px', 
        zIndex: 10
      }}
      onClick={onClick}
    >
    </div>
  );
};



export { NextArrow, PrevArrow };