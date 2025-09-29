import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ progress = 0, show = true, message = "Loading...", animated = true }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (animated && show) {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setAnimatedProgress(progress);
    }
  }, [animated, show, progress]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-dark-primary">
      <div className="flex flex-col items-center space-y-4">
        {/* Progress Bar Container */}
        <div className="w-64 h-1 bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-black dark:bg-white transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, animated ? animatedProgress : progress))}%` }}
          />
        </div>

        {/* Optional loading message */}
        {message && (
          <p className="text-black dark:text-white text-sm font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
