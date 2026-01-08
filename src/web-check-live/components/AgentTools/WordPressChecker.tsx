import React, { useState } from 'react';
import styled from '@emotion/styled';
import Modal from 'web-check-live/components/Form/Modal';
import Button from 'web-check-live/components/Form/Button';
import Input from 'web-check-live/components/Form/Input';
import Heading from 'web-check-live/components/Form/Heading';
import colors from 'web-check-live/styles/colors';
import { toast } from 'react-toastify';

const Card = styled.div`
  background: ${colors.backgroundLighter};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid ${colors.primaryTransparent};
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  &:last-child { border-bottom: none; }
  strong { color: ${colors.primary}; }
`;

const Badge = styled.span<{ type?: 'success' | 'warning' | 'danger' | 'info' }>`
  background: ${props => 
    props.type === 'success' ? colors.success : 
    props.type === 'danger' ? colors.danger : 
    props.type === 'warning' ? colors.warning : 
    colors.primary};
  color: ${colors.background};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
`;

interface WordPressCheckerProps {
  isOpen: boolean;
  closeModal: () => void;
  initialUrl?: string;
}

const WordPressChecker: React.FC<WordPressCheckerProps> = ({ isOpen, closeModal, initialUrl }) => {
  const [url, setUrl] = useState(initialUrl || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const checkWordPress = async () => {
    if (!url) return;
    setLoading(true);
    setResults(null);
    try {
      const api = import.meta.env.PUBLIC_API_ENDPOINT || '/api';
      const response = await fetch(`${api}/wordpress-check?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      toast.error('Failed to check WordPress status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <Heading size="medium">WordPress Diagnostic Tool</Heading>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <Input 
          value={url} 
          onChange={(e: any) => setUrl(e.target.value)} 
          placeholder="Enter domain (e.g. example.com)"
        />
        <Button onClick={checkWordPress} disabled={loading}>
          {loading ? 'Scanning...' : 'Check'}
        </Button>
      </div>

      {results && (
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Card>
            <Heading size="small">Core Status</Heading>
            <ResultRow>
              <span>Is WordPress?</span>
              <Badge type={results.isWordPress ? 'success' : 'danger'}>
                {results.isWordPress ? 'YES' : 'NO'}
              </Badge>
            </ResultRow>
            {results.isWordPress && (
              <>
                <ResultRow>
                  <span>Version</span>
                  <span>
                    {results.version || 'Unknown'} 
                    {results.needsUpdate && <Badge type="warning" style={{marginLeft: '0.5rem'}}>Update Available ({results.latestVersion})</Badge>}
                  </span>
                </ResultRow>
                <ResultRow>
                  <span>PHP Version</span>
                  <span>{results.phpVersion || 'Unknown'}</span>
                </ResultRow>
              </>
            )}
          </Card>

          {results.isWordPress && (
            <>
              <Card>
                <Heading size="small">Site Info</Heading>
                <ResultRow>
                  <span>Active Theme</span>
                  <strong>{results.theme || 'Unknown'}</strong>
                </ResultRow>
                <ResultRow>
                  <span>Detected Plugins</span>
                  <strong>{results.pluginCount}</strong>
                </ResultRow>
              </Card>

              {results.errors && results.errors.length > 0 && (
                <Card style={{ borderColor: colors.danger }}>
                  <Heading size="small" color={colors.danger}>Critical Errors</Heading>
                  {results.errors.map((err: any, i: number) => (
                    <div key={i} style={{ color: colors.danger, marginBottom: '0.5rem' }}>
                      <strong>[{err.type.toUpperCase()}]</strong> {err.message}
                    </div>
                  ))}
                </Card>
              )}

              {results.securityIssues && results.securityIssues.length > 0 && (
                <Card style={{ borderColor: colors.warning }}>
                  <Heading size="small" color={colors.warning}>Security Warnings</Heading>
                  {results.securityIssues.map((issue: string, i: number) => (
                    <div key={i} style={{ marginBottom: '0.5rem' }}>⚠️ {issue}</div>
                  ))}
                </Card>
              )}

              {results.performanceHints && results.performanceHints.length > 0 && (
                <Card style={{ borderColor: colors.info }}>
                  <Heading size="small" color={colors.info}>Performance Hints</Heading>
                  {results.performanceHints.map((hint: string, i: number) => (
                    <div key={i} style={{ marginBottom: '0.5rem' }}>ℹ️ {hint}</div>
                  ))}
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default WordPressChecker;
