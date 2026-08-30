import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  MailCheck,
  ArrowRight
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { signIn, signUp, resetPassword, updatePassword, isPasswordReset } = useAuth();

  // Mode: 'login' | 'signup' | 'forgot' | 'update_password' | 'verify_email'
  const [mode, setMode] = useState(isPasswordReset ? 'update_password' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If the modal isn't open and we aren't in recovery mode, don't render
  if (!isOpen && !isPasswordReset) return null;

  const currentMode = isPasswordReset ? 'update_password' : mode;

  const resetFormState = () => {
    setError('');
    setMessage('');
    setPassword('');
    setConfirmPassword('');
  };

  const switchMode = (newMode) => {
    resetFormState();
    setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // --- Validations ---
    if (currentMode !== 'forgot' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if ((currentMode === 'signup' || currentMode === 'update_password') && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);

      if (currentMode === 'login') {
        await signIn(email, password);
        onClose();
      } else if (currentMode === 'signup') {
        const data = await signUp(email, password);
        // If user already logged in via auto-confirm session
        if (data?.session) {
          setMessage('Account created successfully! You are now logged in.');
          setTimeout(() => onClose(), 1200);
        } else {
          // Email verification required
          setMode('verify_email');
        }
      } else if (currentMode === 'forgot') {
        await resetPassword(email);
        setMessage('Password reset link sent! Please check your email inbox.');
      } else if (currentMode === 'update_password') {
        await updatePassword(password);
        setMessage('Password updated successfully! You can now continue.');
        setTimeout(() => {
          switchMode('login');
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        {!isPasswordReset && (
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        )}

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            {currentMode === 'login' && <LogIn size={24} />}
            {currentMode === 'signup' && <UserPlus size={24} />}
            {(currentMode === 'forgot' || currentMode === 'update_password') && <KeyRound size={24} />}
            {currentMode === 'verify_email' && <MailCheck size={24} />}
          </div>
          <h2>
            {currentMode === 'login' && 'Welcome Back'}
            {currentMode === 'signup' && 'Create an Account'}
            {currentMode === 'forgot' && 'Reset Password'}
            {currentMode === 'update_password' && 'Set New Password'}
            {currentMode === 'verify_email' && 'Verify Your Email'}
          </h2>
          <p className="auth-subtitle">
            {currentMode === 'login' && 'Sign in to access and manage your job pipeline.'}
            {currentMode === 'signup' && 'Start tracking your career journey with your personal dashboard.'}
            {currentMode === 'forgot' && 'Enter your registered email to receive a password reset link.'}
            {currentMode === 'update_password' && 'Choose a new, secure password for your account.'}
            {currentMode === 'verify_email' && 'We have sent a verification link to your email.'}
          </p>
        </div>

        {/* Tabs for Login / Sign Up */}
        {currentMode !== 'forgot' && currentMode !== 'update_password' && currentMode !== 'verify_email' && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${currentMode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              <LogIn size={16} /> Log In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${currentMode === 'signup' ? 'active' : ''}`}
              onClick={() => switchMode('signup')}
            >
              <UserPlus size={16} /> Sign Up
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="auth-alert success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {/* --- Verify Email Screen --- */}
        {currentMode === 'verify_email' ? (
          <div className="verify-email-box">
            <div className="auth-alert success" style={{ textAlign: 'left' }}>
              <CheckCircle2 size={20} className="flex-shrink-0" />
              <span>
                Account created! A confirmation link has been sent to{' '}
                <strong className="verify-email-highlight">{email}</strong>.
              </span>
            </div>

            <p>
              Please open your inbox (or spam folder) and click the verification link.
              Once confirmed, you can log in below to access your dashboard.
            </p>

            <button
              type="button"
              className="btn btn-primary auth-submit-btn"
              onClick={() => switchMode('login')}
            >
              <span>Go to Log In</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          /* --- Standard Form for Login / Signup / Forgot / Update --- */
          <form onSubmit={handleSubmit} className="auth-form">
            {currentMode !== 'update_password' && (
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="field-icon" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    disabled={submitting}
                  />
                </div>
              </div>
            )}

            {currentMode !== 'forgot' && (
              <div className="form-group">
                <div className="label-with-action">
                  <label>Password</label>
                  {currentMode === 'login' && (
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => switchMode('forgot')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    disabled={submitting}
                  />
                </div>
              </div>
            )}

            {(currentMode === 'signup' || currentMode === 'update_password') && (
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                    disabled={submitting}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {currentMode === 'login' && 'Sign In'}
                  {currentMode === 'signup' && 'Create Account'}
                  {currentMode === 'forgot' && 'Send Reset Link'}
                  {currentMode === 'update_password' && 'Save New Password'}
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Back link */}
        {currentMode === 'forgot' && (
          <div className="auth-footer">
            <button
              type="button"
              className="link-btn back-link"
              onClick={() => switchMode('login')}
            >
              ← Back to Log In
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
