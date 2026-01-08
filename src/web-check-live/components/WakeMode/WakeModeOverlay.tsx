import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { Canvas } from '@react-three/fiber';
import ServerRacksScene from './ServerRacksScene';
import useGlobalUptime from '../../hooks/useGlobalUptime';
import colors from '../../styles/colors';

const OverlayContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  cursor: pointer;
`;

const UptimeDisplay = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: 'PTMono', monospace;
  color: ${colors.primary};
  font-size: 1.5rem;
  pointer-events: none;
  border: 1px solid ${colors.primary};
  box-shadow: 0 0 10px ${colors.primary};
`;

interface WakeModeOverlayProps {
  onClick: () => void;
}

const WakeModeOverlay: React.FC<WakeModeOverlayProps> = ({ onClick }) => {
  const uptime = useGlobalUptime();

  useEffect(() => {
    const handleKeyDown = () => {
      onClick();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <OverlayContainer onClick={onClick}>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ServerRacksScene />
      </Canvas>
      <UptimeDisplay>
        {uptime.formatted}
      </UptimeDisplay>
    </OverlayContainer>
  );
};

export default WakeModeOverlay;
