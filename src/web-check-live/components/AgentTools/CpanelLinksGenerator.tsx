import React, { useState } from 'react';
import styled from '@emotion/styled';
import Modal from 'web-check-live/components/Form/Modal';
import Button from 'web-check-live/components/Form/Button';
import Input from 'web-check-live/components/Form/Input';
import Heading from 'web-check-live/components/Form/Heading';
import colors from 'web-check-live/styles/colors';
import { toast } from 'react-toastify';

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const LinkCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${colors.backgroundLighter};
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: ${colors.textColor};
  border: 1px solid transparent;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  .label {
    font-weight: bold;
    text-align: center;
  }
`;

interface CpanelLinksGeneratorProps {
  isOpen: boolean;
  closeModal: () => void;
  initialDomain?: string;
}

const CpanelLinksGenerator: React.FC<CpanelLinksGeneratorProps> = ({ isOpen, closeModal, initialDomain }) => {
  const [domain, setDomain] = useState(initialDomain || '');
  const [cpanelUrl, setCpanelUrl] = useState('');
  const [generatedLinks, setGeneratedLinks] = useState<any[]>([]);

  const generateLinks = () => {
    if (!domain) return;
    
    // Normalize domain
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Determine base URL (prefer manual cPanel URL if provided, else guess)
    let baseUrl = cpanelUrl ? cpanelUrl.replace(/\/$/, '') : `https://${cleanDomain}:2083`;
    if (!baseUrl.startsWith('http')) baseUrl = `https://${baseUrl}`;

    const links = [
      { label: 'File Manager', icon: '📂', url: `${baseUrl}/cpsess/filemanager` },
      { label: 'Email Accounts', icon: '📧', url: `${baseUrl}/frontend/jupiter/mail/index.html` },
      { label: 'phpMyAdmin', icon: '🗄️', url: `${baseUrl}/frontend/jupiter/sql/index.html` },
      { label: 'DNS Zone Editor', icon: '🌐', url: `${baseUrl}/frontend/jupiter/zone_editor/index.html` },
      { label: 'SSL/TLS Status', icon: '🔒', url: `${baseUrl}/frontend/jupiter/ssl/index.html` },
      { label: 'Error Logs', icon: '⚠️', url: `${baseUrl}/frontend/jupiter/errors/index.html` },
      { label: 'WordPress Manager', icon: 'W', url: `${baseUrl}/frontend/jupiter/softaculous/index.live.php` },
    ];

    setGeneratedLinks(links);
    toast.success('Links generated!');
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <Heading size="medium">cPanel Quick Links</Heading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        <Input 
          value={domain} 
          onChange={(e: any) => setDomain(e.target.value)} 
          placeholder="Domain (e.g. example.com)"
        />
        <Input 
          value={cpanelUrl} 
          onChange={(e: any) => setCpanelUrl(e.target.value)} 
          placeholder="Custom cPanel URL (Optional, e.g. https://server.host.com:2083)"
        />
        <Button onClick={generateLinks}>Generate Links</Button>
      </div>

      {generatedLinks.length > 0 && (
        <LinkGrid>
          {generatedLinks.map((link, i) => (
            <LinkCard key={i} href={link.url} target="_blank" rel="noopener noreferrer">
              <span className="icon">{link.icon}</span>
              <span className="label">{link.label}</span>
            </LinkCard>
          ))}
        </LinkGrid>
      )}
    </Modal>
  );
};

export default CpanelLinksGenerator;
