import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import colors from 'web-check-live/styles/colors';
import WordPressChecker from './WordPressChecker';
import CpanelLinksGenerator from './CpanelLinksGenerator';
import BatchChecker from './BatchChecker';
import ExplanationGenerator from './ExplanationGenerator';

const ToolbarContainer = styled.div`
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const MainButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.primary}, #4a90e2);
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: transform 0.2s;
  z-index: 1001;

  &:hover {
    transform: scale(1.1);
  }
`;

const ToolsPanel = styled.div<{ expanded: boolean }>`
  position: absolute;
  bottom: 5rem;
  right: 0;
  width: 320px;
  background: ${colors.backgroundLighter};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  padding: 1rem;
  border: 1px solid ${colors.primaryTransparent};
  
  opacity: ${props => props.expanded ? 1 : 0};
  transform: ${props => props.expanded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)'};
  pointer-events: ${props => props.expanded ? 'all' : 'none'};
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom right;

  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
`;

const ToolCard = styled.div`
  background: ${colors.background};
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background 0.2s;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255,255,255,0.05);
    border-color: ${colors.primaryTransparent};
  }

  .icon { font-size: 1.25rem; }
  .label { font-weight: bold; color: ${colors.textColor}; font-size: 0.9rem; }
  .desc { font-size: 0.75rem; color: #888; }
`;

const FloatingToolbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tools = [
    { id: 'wp', label: 'WordPress Checker', icon: 'W', desc: 'Diagnose WP issues & security' },
    { id: 'cpanel', label: 'cPanel Quick Links', icon: '🔧', desc: 'Direct access to tools' },
    { id: 'batch', label: 'Batch Domain Check', icon: '⚡', desc: 'Check multiple domains' },
    { id: 'explain', label: 'Explain to Customer', icon: '💬', desc: 'Generate plain English explanations' },
  ];

  const handleToolClick = (id: string) => {
    setActiveModal(id);
    setExpanded(false);
  };

  return (
    <ToolbarContainer ref={containerRef}>
      <ToolsPanel expanded={expanded}>
        {tools.map(tool => (
          <ToolCard key={tool.id} onClick={() => handleToolClick(tool.id)}>
            <span className="icon">{tool.icon}</span>
            <div>
              <div className="label">{tool.label}</div>
              <div className="desc">{tool.desc}</div>
            </div>
          </ToolCard>
        ))}
      </ToolsPanel>
      
      <MainButton onClick={() => setExpanded(!expanded)} title="Support Agent Tools">
        🛠️
      </MainButton>

      <WordPressChecker 
        isOpen={activeModal === 'wp'} 
        closeModal={() => setActiveModal(null)} 
      />
      <CpanelLinksGenerator 
        isOpen={activeModal === 'cpanel'} 
        closeModal={() => setActiveModal(null)} 
      />
      <BatchChecker 
        isOpen={activeModal === 'batch'} 
        closeModal={() => setActiveModal(null)} 
      />
      <ExplanationGenerator 
        isOpen={activeModal === 'explain'} 
        closeModal={() => setActiveModal(null)} 
      />
    </ToolbarContainer>
  );
};

export default FloatingToolbar;
