import React, { useState } from 'react';
import styled from '@emotion/styled';
import Modal from 'web-check-live/components/Form/Modal';
import Button from 'web-check-live/components/Form/Button';
import Heading from 'web-check-live/components/Form/Heading';
import colors from 'web-check-live/styles/colors';
import { toast } from 'react-toastify';

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  background: ${colors.background};
  color: ${colors.textColor};
  border: 1px solid ${colors.primaryTransparent};
  border-radius: 4px;
  padding: 0.5rem;
  font-family: monospace;
  resize: vertical;
  margin-bottom: 1rem;
  &:focus { outline: none; border-color: ${colors.primary}; }
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  th, td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  th { color: ${colors.primary}; }
`;

interface BatchCheckerProps {
  isOpen: boolean;
  closeModal: () => void;
}

const BatchChecker: React.FC<BatchCheckerProps> = ({ isOpen, closeModal }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runBatchCheck = async () => {
    const domains = input.split('\n').map(d => d.trim()).filter(d => d);
    if (domains.length === 0) return;
    if (domains.length > 5) {
      toast.error('Max 5 domains allowed');
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const api = import.meta.env.PUBLIC_API_ENDPOINT || '/api';
      const response = await fetch(`${api}/batch-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains })
      });
      const data = await response.json();
      if (data.results) {
        setResults(data.results);
      } else {
        toast.error(data.error || 'Batch check failed');
      }
    } catch (error) {
      toast.error('Network error during batch check');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: any) => {
    if (!status) return '❓';
    if (status.error) return '❌';
    if (status.valid === false) return '❌'; // For SSL
    if (status.status === 'UP') return '✅'; // For Status
    return '✅';
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <Heading size="medium">Batch Domain Checker</Heading>
      <StyledTextarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter domains (one per line, max 5)&#10;example.com&#10;test.com"
      />
      <Button onClick={runBatchCheck} disabled={loading}>
        {loading ? 'Checking...' : 'Check All'}
      </Button>

      {results.length > 0 && (
        <ResultsTable>
          <thead>
            <tr>
              <th>Domain</th>
              <th>SSL</th>
              <th>DNS</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res, i) => (
              <tr key={i}>
                <td>{res.domain}</td>
                <td>
                  {getStatusIcon(res.ssl)} 
                  {res.ssl?.daysRemaining && <small> ({res.ssl.daysRemaining}d)</small>}
                </td>
                <td>{res.dns?.A ? '✅' : '❌'}</td>
                <td>
                  {res.status?.status === 'UP' ? '✅' : '❌'}
                  {res.status?.responseTime && <small> ({res.status.responseTime}ms)</small>}
                </td>
              </tr>
            ))}
          </tbody>
        </ResultsTable>
      )}
    </Modal>
  );
};

export default BatchChecker;
