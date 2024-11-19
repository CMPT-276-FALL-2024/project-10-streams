import React from 'react';

const NextArrow = (props) => { const { className, style, onClick } = props; 
return ( <div className={className} style={{ ...style, display: 'block', background: 'gray', borderRadius: '50%' }} onClick={onClick} > <span style={{ color: 'white', fontSize: '20px', padding: '10px' }}>›</span> </div> ); };

const PrevArrow = (props) => { const { className, style, onClick } = props; return ( <div className={className} style={{ ...style, display: 'block', background: 'gray', borderRadius: '50%' }} onClick={onClick} > <span style={{ color: 'white', fontSize: '20px', padding: '10px' }}>‹</span> </div> ); };

export { NextArrow, PrevArrow };