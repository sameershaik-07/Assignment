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

  let rawUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
    rawUrl = `https://${rawUrl}`;
  }
  const API_URL = rawUrl.replace(/\/+$/, '');

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <div>
          <span className="brand-title">DevOps Deployment Platform</span>
          <span className="brand-subtitle">PostgreSQL • Prisma • Railway</span>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          Swagger Docs
        </a>

        {user ? (
          <div className="user-profile-badge">
            <span className="user-email">{user.email}</span>
            <button className="platform-id-pill" onClick={handleCopyPlatformId} title="Click to copy Platform ID">
              <code>{user.platformId}</code>
              <span className="pill-copy-tag">{copied ? '✓ Copied' : 'Copy'}</span>
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
