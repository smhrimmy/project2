import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DNSPropagationGlobe, type DNSServerResult } from './DNSPropagationGlobe';

interface DNSPropagationProps {
  domain: string;
}

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME'];

const DNSPropagation: React.FC<DNSPropagationProps> = ({ domain }) => {
  const [recordType, setRecordType] = useState('A');
  const [results, setResults] = useState<DNSServerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!domain) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get<{ servers: DNSServerResult[] }>('/api/dns-propagation', {
          params: { domain, recordType }
        });

        if (response.data && response.data.servers) {
          setResults(response.data.servers);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Error fetching DNS propagation:', err);
        setError('Failed to load propagation data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [domain, recordType, retryCount]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Global DNS Propagation
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Check how {domain}'s DNS records propagate across the globe.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="record-type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Record Type:
          </label>
          <select
            id="record-type"
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white p-2"
            disabled={loading}
          >
            {RECORD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative min-h-[500px] rounded-xl overflow-hidden bg-gray-950 border border-gray-800">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-400">Scanning global nameservers...</span>
            </div>
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-center p-6 max-w-md">
              <div className="text-red-500 text-xl mb-2">⚠️</div>
              <h4 className="text-lg font-medium text-white mb-1">Scan Failed</h4>
              <p className="text-gray-400 text-sm">{error}</p>
              <button 
                onClick={() => setRetryCount(c => c + 1)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <DNSPropagationGlobe results={results} />
        )}
      </div>
    </div>
  );
};

export default DNSPropagation;