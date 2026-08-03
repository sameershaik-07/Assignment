import { useState } from 'react';
import { registerUser } from '../services/api';

export default function RegisterForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await registerUser(email, password);
      setLoading(false);
      onSuccess(data.user);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-card glassmorphism">
      <div className="auth-header">
        <h3>Create Account</h3>
        <p>Register to obtain your unique Platform ID & database record</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-email">Email Address</label>
          <input
            id="reg-email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <span className="field-hint">Minimum 6 characters</span>
        </div>

        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register Account'}
        </button>
      </form>
    </div>
  );
}
