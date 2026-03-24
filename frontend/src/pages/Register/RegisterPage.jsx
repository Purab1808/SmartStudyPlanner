import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import FormField from '../../components/forms/FormField';
import InlineMessage from '../../components/feedback/InlineMessage';
import { authApi } from '../../services/api';

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

const initialState = {
  name: '',
  email: '',
  password: '',
  university: '',
  course: '',
  availableDailyHours: 5,
  preferredStudyWindow: 'evening',
  breakPreferenceMinutes: 25
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyRegistration } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authApi.requestRegisterOtp({
        name: form.name,
        email: form.email,
        password: form.password,
        university: form.university,
        course: form.course,
        studyPreferences: {
          availableDailyHours: Number(form.availableDailyHours),
          preferredStudyWindow: form.preferredStudyWindow,
          breakPreferenceMinutes: Number(form.breakPreferenceMinutes)
        }
      });
      setOtpSent(true);
      setSuccess('OTP sent to your email. Enter it below to finish registration.');
    } catch (err) {
      setError(getApiError(err, 'Unable to send OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await verifyRegistration({
        email: form.email,
        otp
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getApiError(err, 'Unable to verify OTP'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-hero">
        <div className="auth-copy">
          <span className="eyebrow">New workspace</span>
          <h1>Build a study system that respects both deadlines and recovery.</h1>
          <p>
            Set your study rhythm once, then let the planner adapt around your
            real fatigue levels and available time.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <span className="eyebrow">Create account</span>
        <h2>Start your study planner</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field full">
            <InlineMessage type="success" message={success} />
            <InlineMessage type="error" message={error} />
          </div>
          <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            helperText={passwordRules.join(' | ')}
          />
          <FormField label="University" name="university" value={form.university} onChange={handleChange} required />
          <FormField label="Course" name="course" value={form.course} onChange={handleChange} required />
          <FormField
            label="Preferred Study Window"
            name="preferredStudyWindow"
            value={form.preferredStudyWindow}
            onChange={handleChange}
            required
            options={[
              { value: 'morning', label: 'Morning' },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'evening', label: 'Evening' },
              { value: 'flexible', label: 'Flexible' }
            ]}
          />
          <FormField
            label="Daily Study Hours"
            name="availableDailyHours"
            type="number"
            min="1"
            max="16"
            step="0.5"
            value={form.availableDailyHours}
            onChange={handleChange}
            required
          />
          <FormField
            label="Break Preference (minutes)"
            name="breakPreferenceMinutes"
            type="number"
            min="5"
            max="120"
            value={form.breakPreferenceMinutes}
            onChange={handleChange}
            required
          />
          <div className="field full">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        </form>

        {otpSent ? (
          <form className="stack" onSubmit={handleVerifyOtp} style={{ marginTop: 22 }}>
            <FormField
              label="Email OTP"
              name="otp"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter 6-digit OTP"
              helperText={`We sent a 6-digit verification code to ${form.email}.`}
              required
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Verifying OTP...' : 'Verify OTP and create account'}
            </button>
          </form>
        ) : null}

        <p className="page-copy" style={{ marginTop: 18 }}>
          Already registered? <Link className="subtle-link" to="/login">Log in</Link>
        </p>
      </section>
    </div>
  );
}
