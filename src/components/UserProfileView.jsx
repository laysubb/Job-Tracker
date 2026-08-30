import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import LogoutConfirmModal from './LogoutConfirmModal';
import DeleteAccountConfirmModal from './DeleteAccountConfirmModal';
import {
  User,
  KeyRound,
  ShieldCheck,
  Send,
  Activity,
  Users,
  Trophy,
  XCircle,
  Clock,
  ArrowLeft,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  PieChart,
  Calendar,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function UserProfileView() {
  const { user, updatePassword, deleteAccount, signOut } = useAuth();
  const { jobs, setActiveTab } = useJobs();

  // Password update form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- Calculate User Statistics ---
  const totalApplied = jobs.length;
  const activeCount = jobs.filter(j =>
    ['applied', 'assessment', 'first_interview', 'second_interview', 'final_round'].includes(j.status)
  ).length;

  const interviewCount = jobs.filter(j =>
    ['first_interview', 'second_interview', 'final_round', 'offer', 'accepted', 'declined'].includes(j.status) ||
    (j.history || []).some(h => ['first_interview', 'second_interview', 'final_round'].includes(h.stage))
  ).length;

  const offerCount = jobs.filter(j => ['offer', 'accepted'].includes(j.status)).length;
  const rejectedCount = jobs.filter(j => j.status === 'rejected').length;

  const responseRate = totalApplied > 0
    ? Math.round(((totalApplied - jobs.filter(j => j.status === 'applied').length) / totalApplied) * 100)
    : 0;

  const offerRate = totalApplied > 0
    ? Math.round((offerCount / totalApplied) * 100)
    : 0;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await updatePassword(newPassword);
      setSuccessMsg('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    await signOut();
    setActiveTab('kanban');
  };

  const handleDeleteAccountConfirm = async () => {
    setIsDeleteModalOpen(false);
    await deleteAccount();
    setActiveTab('kanban');
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Active Hunter';

  return (
    <div className="profile-container animate-fade-in">
      {/* Top Navigation / Breadcrumb */}
      <div className="profile-top-bar">
        <button className="btn btn-outline" onClick={() => setActiveTab('kanban')}>
          <ArrowLeft size={16} />
          <span>Back to Kanban Pipeline</span>
        </button>
      </div>

      {/* User Header Profile Card */}
      <div className="profile-hero-card glass-panel">
        <div className="profile-hero-left">
          <div className="profile-avatar-large">
            <span>{userInitial}</span>
          </div>
          <div className="profile-hero-info">
            <div className="profile-title-group">
              <h2>{user?.email || 'CareerPulse Hunter'}</h2>
              <span className="badge badge-indigo">
                <ShieldCheck size={13} /> Verified Account
              </span>
            </div>
            <p className="profile-subtitle">
              <Calendar size={14} /> Member since: <strong>{joinedDate}</strong>
            </p>
            <p className="profile-uid-text">
              User ID: <code>{user?.id || 'Anonymous'}</code>
            </p>
          </div>
        </div>

        <div className="profile-hero-actions">
          <button
            className="btn btn-danger"
            onClick={() => setIsLogoutModalOpen(true)}
            title="Log out of this account"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid: Statistics & Security */}
      <div className="profile-grid">
        {/* Left Column: Overall Job Stats */}
        <div className="profile-card glass-panel">
          <div className="profile-card-header">
            <div className="card-header-icon bg-indigo">
              <PieChart size={20} className="text-indigo" />
            </div>
            <div>
              <h3>Overall Application Stats</h3>
              <p>Summary of all jobs tracked in your pipeline</p>
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <div className="stat-box-icon bg-indigo">
                <Send size={18} className="text-indigo" />
              </div>
              <div className="stat-box-data">
                <span className="stat-box-number">{totalApplied}</span>
                <span className="stat-box-label">Total Applied</span>
              </div>
            </div>

            <div className="profile-stat-box">
              <div className="stat-box-icon bg-cyan">
                <Activity size={18} className="text-cyan" />
              </div>
              <div className="stat-box-data">
                <span className="stat-box-number text-cyan">{activeCount}</span>
                <span className="stat-box-label">Active Applications</span>
              </div>
            </div>

            <div className="profile-stat-box">
              <div className="stat-box-icon bg-amber">
                <Users size={18} className="text-amber" />
              </div>
              <div className="stat-box-data">
                <span className="stat-box-number text-amber">{interviewCount}</span>
                <span className="stat-box-label">Interviews Reached</span>
              </div>
            </div>

            <div className="profile-stat-box">
              <div className="stat-box-icon bg-emerald">
                <Trophy size={18} className="text-emerald" />
              </div>
              <div className="stat-box-data">
                <span className="stat-box-number text-emerald">{offerCount}</span>
                <span className="stat-box-label">Offers Landed</span>
              </div>
            </div>

            <div className="profile-stat-box">
              <div className="stat-box-icon bg-rose">
                <XCircle size={18} className="text-rose" />
              </div>
              <div className="stat-box-data">
                <span className="stat-box-number text-rose">{rejectedCount}</span>
                <span className="stat-box-label">Rejections</span>
              </div>
            </div>

            <div className="profile-stat-box">
              <div className="stat-box-icon bg-purple">
                <Clock size={18} className="text-purple" />
              </div>
              <div className="stat-box-data">
                <span className="stat-box-number text-purple">{responseRate}%</span>
                <span className="stat-box-label">Response Activity Rate</span>
              </div>
            </div>
          </div>

          {/* Quick Pipeline Progress Bar */}
          <div className="pipeline-bar-wrapper">
            <span className="pipeline-bar-title">Pipeline Health: <strong>{offerRate}% Offer Rate</strong></span>
            <div className="pipeline-progress-bar">
              <div
                className="bar-segment bar-applied"
                style={{ width: `${totalApplied ? (jobs.filter(j => j.status === 'applied').length / totalApplied) * 100 : 0}%` }}
                title="Applied"
              />
              <div
                className="bar-segment bar-interview"
                style={{ width: `${totalApplied ? (interviewCount / totalApplied) * 100 : 0}%` }}
                title="Interviews"
              />
              <div
                className="bar-segment bar-offer"
                style={{ width: `${totalApplied ? (offerCount / totalApplied) * 100 : 0}%` }}
                title="Offers"
              />
              <div
                className="bar-segment bar-rejected"
                style={{ width: `${totalApplied ? (rejectedCount / totalApplied) * 100 : 0}%` }}
                title="Rejected"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Change Password & Danger Zone */}
        <div className="profile-right-col">
          {/* Change Password Card */}
          <div className="profile-card glass-panel">
            <div className="profile-card-header">
              <div className="card-header-icon bg-purple">
                <KeyRound size={20} className="text-purple" />
              </div>
              <div>
                <h3>Account Security</h3>
                <p>Change your password or update credentials</p>
              </div>
            </div>

            {errorMsg && (
              <div className="auth-alert error">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="auth-alert success">
                <CheckCircle2 size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="profile-form">
              <div className="form-group">
                <label>New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="auth-input"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    required
                    placeholder="Re-type new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                    disabled={submitting}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary profile-submit-btn" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={16} />
                    <span>Save New Password</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="profile-card glass-panel danger-zone-card">
            <div className="profile-card-header">
              <div className="card-header-icon bg-rose">
                <AlertTriangle size={20} className="text-rose" />
              </div>
              <div>
                <h3 className="text-danger">Danger Zone</h3>
                <p>Permanently delete this account and all data</p>
              </div>
            </div>

            <p className="danger-zone-desc">
              Once deleted, your account and all associated applications, history, and reminders cannot be recovered.
            </p>

            <button
              type="button"
              className="btn btn-danger delete-acc-btn"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={16} />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccountConfirm}
        userEmail={user?.email || 'this account'}
      />
    </div>
  );
}
