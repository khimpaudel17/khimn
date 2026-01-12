import React from 'react';

const GlassCard = ({ children, className = '', style = {} }) => {
    return (
        <div
            style={{ ...style }}
            className={`glass-card ${className}`}
        >
            {children}
            <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.15); /* Translucent white */
          backdrop-filter: blur(20px); /* Heavy blur for the "frosted" look */
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3); /* Subtle light border */
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15); /* Soft shadow for depth */
          color: white;
          padding: 2rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
      `}</style>
        </div>
    );
};

export default GlassCard;
