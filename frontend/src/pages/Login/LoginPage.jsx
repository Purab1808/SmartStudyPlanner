import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import FormField from '../../components/forms/FormField';
import InlineMessage from '../../components/feedback/InlineMessage';
import { authApi } from '../../services/api';

const initialState = { email: '', password: '' };
const resetInitialState = { email: '', otp: '', newPassword: '' };
const passwordRules = [
  'At least 8 characters',
  'At least one uppercase letter',
  'At least one lowercase letter',
  'At least one number'
];

const getApiError = (err, fallback) => {
  if (!err?.response) {
    return 'Backend is not reachable. Start the backend server and try again.';
  }

  return err.response.data?.errors?.[0]?.message || err.response.data?.message || fallback;
};

export default function LoginPage() {
  const [form, setForm] = useState(initialState);
  const [resetForm, setResetForm] = useState(resetInitialState);
  const [showReset, setShowReset] = useState(false);
  const [resetStep, setResetStep] = useState('request');
  const [error, setError] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleResetChange = (event) => {
    setResetForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(getApiError(err, 'Unable to log in'));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResetOtp = async (event) => {
    event.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResetLoading(true);

    try {
      await authApi.requestPasswordResetOtp({ email: resetForm.email });
      setResetStep('verify');
      setResetSuccess('We sent a password reset OTP to your email. Enter it below with your new password.');
    } catch (err) {
      setResetError(getApiError(err, 'Unable to send password reset OTP'));
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResetLoading(true);

    try {
      await authApi.resetPassword({
        email: resetForm.email,
        otp: resetForm.otp,
        newPassword: resetForm.newPassword
      });
      setResetSuccess('Password reset successful. You can now log in with your new password.');
      setResetStep('request');
      setForm((prev) => ({ ...prev, email: resetForm.email, password: '' }));
      setResetForm(resetInitialState);
    } catch (err) {
      setResetError(getApiError(err, 'Unable to reset password'));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-hero">
        <div className="auth-copy">
          <span className="eyebrow">Academic rhythm</span>
          <h1>Plan study sessions with attention to mental energy.</h1>
          <p>
            This original interface is built for deliberate study planning. Track
            fatigue, distribute workload, and keep exam prep realistic.
          </p>
        </div>
        <div className="hero-grid">
          <div className="hero-note">
            <strong>Deadline-aware</strong>
            <p>See urgent subjects before they become stressful.</p>
          </div>
          <div className="hero-note">
            <strong>Mental-load aware</strong>
            <p>Daily fatigue signals influence schedule intensity.</p>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <span className="eyebrow">Welcome back</span>
        <h2>Log in to your planner</h2>
        <p className="page-copy">Use your registered email and password.</p>

        <form className="stack" onSubmit={handleSubmit}>
          <InlineMessage type="error" message={error} />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <div className="auth-helper-actions">
          <button
            className="text-link-btn"
            type="button"
            onClick={() => {
              setShowReset((prev) => !prev);
              setResetError('');
              setResetSuccess('');
            }}
          >
            {showReset ? 'Hide password reset' : 'Forgot password? Reset through email'}
          </button>
        </div>

        {showReset ? (
          <div className="reset-panel">
            <span className="eyebrow">Password recovery</span>
            <h3>Reset your password by email OTP</h3>
            <InlineMessage type="success" message={resetSuccess} />
            <InlineMessage type="error" message={resetError} />

            {resetStep === 'request' ? (
              <form className="stack" onSubmit={handleRequestResetOtp}>
                <FormField
                  label="Registered Email"
                  name="email"
                  type="email"
                  value={resetForm.email}
                  onChange={handleResetChange}
                  required
                  helperText="We will send a 6-digit reset OTP to this email."
                />
                <button className="btn btn-secondary" type="submit" disabled={resetLoading}>
                  {resetLoading ? 'Sending OTP...' : 'Send reset OTP'}
                </button>
              </form>
            ) : (
              <form className="stack" onSubmit={handleResetPassword}>
                <FormField
                  label="Registered Email"
                  name="email"
                  type="email"
                  value={resetForm.email}
                  onChange={handleResetChange}
                  required
                />
                <FormField
                  label="Email OTP"
                  name="otp"
                  value={resetForm.otp}
                  onChange={handleResetChange}
                  placeholder="Enter 6-digit OTP"
                  required
                />
                <FormField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={resetForm.newPassword}
                  onChange={handleResetChange}
                  helperText={passwordRules.join(' | ')}
                  required
                />
                <div className="auth-helper-actions">
                  <button className="btn btn-secondary" type="submit" disabled={resetLoading}>
                    {resetLoading ? 'Updating password...' : 'Reset password'}
                  </button>
                  <button
                    className="text-link-btn"
                    type="button"
                    onClick={() => {
                      setResetStep('request');
                      setResetError('');
                      setResetSuccess('');
                    }}
                  >
                    Request a new OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : null}

        <p className="page-copy" style={{ marginTop: 18 }}>
          New here? <Link className="subtle-link" to="/register">Create an account</Link>
        </p>
      </section>
    </div>
  );
}
