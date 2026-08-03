import { useState } from 'react';
import HealthBadge from './HealthBadge';

export default function Navbar({ user, onLogout }) {
  const [copied, setCopied] = useState(false);

  const handleCopyPlatformId = () => {
    if (user?.platformId) {
      navigator.clipboard.writeText(user.platformId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <header className="navbar glassmorphism">
      <div className="nav-brand">
        <div className="brand-logo">⚡</div>
        <div>
          <span className="brand-title">DevOps Deployment App</span>
          <span className="brand-subtitle">PostgreSQL + Prisma + Railway</span>
        </div>
      </div>

      <div className="nav-actions">
        <HealthBadge />

        <a
          href={`${API_URL}/api-docs`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-link-docs"
        >
          📖 API Swagger Docs
        </a>

        {user ? (
          <div className="user-profile-badge">
            <span className="user-email">{user.email}</span>
            <button className="platform-id-pill" onClick={handleCopyPlatformId} title="Click to copy Platform ID">
              <code>{user.platformId}</code>
              <span className="pill-copy-tag">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button className="btn-secondary btn-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
