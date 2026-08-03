import { useState } from 'react';

export default function PlatformIdModal({ user, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(user.platformId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card glassmorphism animate-pop">
        <div className="modal-header">
          <div className="sparkle-icon">✨</div>
          <h2>Account Created Successfully!</h2>
          <p>Your unique system identifier has been generated.</p>
        </div>

        <div className="platform-id-box">
          <span className="label">INTERNAL PLATFORM ID</span>
          <div className="id-display">
            <code>{user.platformId}</code>
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="info-callout">
          <p>
            📌 <strong>Note:</strong> Your <strong>Platform ID</strong> is your internal identifier stored in PostgreSQL alongside your email (<code>{user.email}</code>).
          </p>
        </div>

        <button className="btn-primary full-width" onClick={onClose}>
          Continue to Login
        </button>
      </div>
    </div>
  );
}
