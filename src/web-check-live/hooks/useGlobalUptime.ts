import { useState, useEffect } from 'react';

const useGlobalUptime = () => {
  const [uptime, setUptime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    formatted: 'Calculating...',
  });

  useEffect(() => {
    // Get start time from localStorage or set it if not exists
    let startTime = localStorage.getItem('appStartTime');
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem('appStartTime', startTime);
    }

    const startTimestamp = parseInt(startTime, 10);

    const calculateUptime = () => {
      const now = Date.now();
      const diff = now - startTimestamp;

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      const formatted = `Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`;

      setUptime({
        days,
        hours,
        minutes,
        seconds,
        formatted,
      });
    };

    // Initial calculation
    calculateUptime();

    // Update every second
    const intervalId = setInterval(calculateUptime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return uptime;
};

export default useGlobalUptime;
