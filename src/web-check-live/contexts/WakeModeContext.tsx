import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface WakeModeContextType {
  isWakeModeActive: boolean;
  toggleWakeMode: () => void;
  exitWakeMode: () => void;
}

const WakeModeContext = createContext<WakeModeContextType | undefined>(undefined);

export const WakeModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isWakeModeActive, setIsWakeModeActive] = useState(false);

  const toggleWakeMode = () => {
    setIsWakeModeActive(prev => !prev);
  };

  const exitWakeMode = () => {
    setIsWakeModeActive(false);
  };

  useEffect(() => {
    const handleToggleEvent = () => {
      toggleWakeMode();
    };

    window.addEventListener('toggleWakeMode', handleToggleEvent);

    return () => {
      window.removeEventListener('toggleWakeMode', handleToggleEvent);
    };
  }, []);

  return (
    <WakeModeContext.Provider value={{ isWakeModeActive, toggleWakeMode, exitWakeMode }}>
      {children}
    </WakeModeContext.Provider>
  );
};

export const useWakeMode = () => {
  const context = useContext(WakeModeContext);
  if (context === undefined) {
    throw new Error('useWakeMode must be used within a WakeModeProvider');
  }
  return context;
};
