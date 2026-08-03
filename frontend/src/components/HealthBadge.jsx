import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

export default function HealthBadge() {
  const [status, setStatus] = useState('checking');
  const [uptime, setUptime] = useState(null);

  const fetchHealth = async () => {
    try {
      const data = await checkHealth();
      if (data.status === 'healthy') {
        setStatus('healthy');
        setUptime(data.uptime);
      } else {
        setStatus('degraded');
      }
    } catch (error) {
      setStatus('down');
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`health-badge status-${status}`}>
      <span className="pulse-dot"></span>
      <span className="badge-text">
        {status === 'healthy' && 'API Online'}
        {status === 'checking' && 'Checking API...'}
        {status === 'degraded' && 'API Degraded'}
        {status === 'down' && 'API Offline'}
      </span>
    </div>
  );
}
