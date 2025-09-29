import React, { useState } from 'react';

// Reusable Ripple Component
const Ripple = ({ children, className = "", onClick, bgColor = "", ...props }) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x: x - 10,
      y: y - 10,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(event);
  };

  return (
    <button
      onClick={createRipple}
      className={`w-full font-sans relative overflow-hidden ${className}`}
      {...props}
    >
      {children}

      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className={`absolute w-5 h-5 ${bgColor} rounded-full pointer-events-none ripple-animation`}
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      <style jsx>{`
        .ripple-animation {
          animation: ripple-spread 0.6s ease-out;
        }

        @keyframes ripple-spread {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(20);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

export default Ripple;
