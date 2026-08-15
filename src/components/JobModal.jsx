import React, { useState, useEffect } from 'react';
import { useJobs } from '../context/JobContext';
import { STATUS_COLUMNS, CATEGORIES } from '../data/seedJobs';
import { 
  X, 
  Building, 
  Briefcase, 
  ExternalLink, 
  Calendar, 
  CalendarPlus,
  Trash2, 
  Plus, 
  FileText, 
  History,
  Check
} from 'lucide-react';
import { getGoogleCalendarUrl, downloadEventIcs } from '../utils/calendarExport';

export default function JobModal() {
  const { 
    isModalOpen, 
    closeModal, 
    editingJob, 
    addJob, 
    updateJob, 
    deleteJob,
    addReminder,
    deleteReminder
  } = useJobs();

  const isEditing = Boolean(editingJob && editingJob.id);

  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [programType, setProgramType] = useState('Graduate Program');
  const [status, setStatus] = useState('applied');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [portalUrl, setPortalUrl] = useState('');
  const [location, setLocation] = useState('Kuala Lumpur, Malaysia');
  const [salaryRange, setSalaryRange] = useState('');
  const [resumeVersion, setResumeVersion] = useState('SWE_Resume_v1.pdf');
  const [notes, setNotes] = useState('');

  // Quick reminder inside modal
  const [remDate, setRemDate] = useState(new Date().toISOString().split('T')[0]);
  const [remTime, setRemTime] = useState('10:00');
  const [remType, setRemType] = useState('1st Round Interview');
  const [remTitle, setRemTitle] = useState('');
  const [remLink, setRemLink] = useState('');
  const [showAddReminderBox, setShowAddReminderBox] = useState(false);

  useEffect(() => {
    if (editingJob) {
      setCompany(editingJob.company || '');
      setRole(editingJob.role || '');
      setCategory(editingJob.category || 'Software Engineering');
      setProgramType(editingJob.programType || 'Graduate Program');
      setStatus(editingJob.status || 'applied');
      setAppliedDate(editingJob.appliedDate || new Date().toISOString().split('T')[0]);
      setPortalUrl(editingJob.portalUrl || '');
      setLocation(editingJob.location || 'Kuala Lumpur, Malaysia');
      setSalaryRange(editingJob.salaryRange || '');
      setResumeVersion(editingJob.resumeVersion || 'SWE_Resume_v1.pdf');
      setNotes(editingJob.notes || '');
    } else {
      setCompany('');
      setRole('');
      setCategory('Software Engineering');
      setProgramType('Graduate Program');
      setStatus('applied');
      setAppliedDate(new Date().toISOString().split('T')[0]);
      setPortalUrl('');
      setLocation('Kuala Lumpur, Malaysia');
      setSalaryRange('');
      setResumeVersion('SWE_Resume_v1.pdf');
      setNotes('');
    }
  }, [editingJob]);

  if (!isModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const payload = {
      company: company.trim(),
      role: role.trim(),
      category,
      programType,
      status,
      appliedDate,
      portalUrl: portalUrl.trim(),
      location: location.trim(),
      salaryRange: salaryRange.trim(),
      resumeVersion: resumeVersion.trim(),
      notes: notes.trim()
    };

    if (isEditing) {
      updateJob(editingJob.id, payload);
    } else {
      addJob(payload);
    }
    closeModal();
  };

  const handleCreateReminderInModal = (e) => {
    e.preventDefault();
    if (!isEditing) return;

    addReminder(editingJob.id, {
      title: remTitle || `${remType} - ${company}`,
      date: remDate,
      time: remTime,
      type: remType,
      durationMinutes: 60,
      locationOrLink: remLink,
      notes: ''
    });

    setRemTitle('');
    setRemLink('');
    setShowAddReminderBox(false);
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-drawer glass-panel animate-slide-in" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEditing ? `Edit Application: ${editingJob.company}` : 'Add New Job Application'}
            </h2>
            <p className="modal-subtitle">
              {isEditing ? 'Update stage, notes, or calendar reminders' : 'Fill in the job details to track its pipeline progress'}
            </p>
          </div>
          <button className="btn btn-outline btn-icon" onClick={closeModal}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid-2">
            <div className="input-group">
              <label className="input-label">Company Name *</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Seek, AWS, Shopee"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Role / Job Title *</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Software Engineering Graduate Program"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                className="input-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Program / Track Type</label>
              <select
                className="input-control"
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}
              >
                <option value="Graduate Program">Graduate Program</option>
                <option value="Campus Recruitment">Campus Recruitment</option>
                <option value="Early Career">Early Career</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Internship">Internship</option>
                <option value="Full-Time SWE">Full-Time SWE</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Pipeline Status</label>
              <select
                className="input-control font-semibold"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>{col.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="input-group">
              <label className="input-label">Application Date</label>
              <input
                type="date"
                className="input-control font-mono"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Location</label>
              <input
                type="text"
                placeholder="e.g. Kuala Lumpur, Malaysia"
                className="input-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Expected Salary / Stipend</label>
              <input
                type="text"
                placeholder="e.g. RM 5,000 - RM 7,000 / mo"
                className="input-control"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="input-group">
              <label className="input-label">Application Portal URL / Form Link</label>
              <div className="input-with-action">
                <input
                  type="url"
                  placeholder="https://..."
                  className="input-control"
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                />
                {portalUrl && (
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="input-addon-btn"
                    title="Open URL in new tab"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Resume / CV Submitted</label>
              <input
                type="text"
                placeholder="e.g. SWE_Resume_v2.pdf"
                className="input-control font-mono"
                value={resumeVersion}
                onChange={(e) => setResumeVersion(e.target.value)}
              />
            </div>
          </div>

          {/* Notes & Prep Section */}
          <div className="input-group">
            <label className="input-label">Notes, Recruiter Contacts & Prep Talking Points</label>
            <textarea
              placeholder="e.g. Workday Job ID, referral contact, behavioral questions asked, coding test format..."
              className="input-control"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Reminders & Interview Deadlines (if editing) */}
          {isEditing && (
            <div className="modal-reminders-section">
              <div className="flex-between mb-3">
                <h4 className="section-subtitle">
                  <Calendar size={15} className="text-purple" />
                  <span>Scheduled Reminders & Deadlines ({(editingJob.reminders || []).length})</span>
                </h4>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => setShowAddReminderBox(!showAddReminderBox)}
                >
                  <Plus size={13} /> {showAddReminderBox ? 'Close' : 'Add Reminder'}
                </button>
              </div>

              {/* Sub-form to add reminder */}
              {showAddReminderBox && (
                <div className="nested-reminder-form glass-panel">
                  <div className="form-grid-3">
                    <div className="input-group mb-0">
                      <label className="input-label">Event Type</label>
                      <select
                        className="input-control"
                        value={remType}
                        onChange={(e) => setRemType(e.target.value)}
                      >
                        <option value="Online Assessment">Online Assessment</option>
                        <option value="1st Round Interview">1st Round Interview</option>
                        <option value="Technical Interview">Technical Interview</option>
                        <option value="Final Round">Final Round</option>
                        <option value="Follow-up Reminder">Follow-up Reminder</option>
                      </select>
                    </div>
                    <div className="input-group mb-0">
                      <label className="input-label">Date</label>
                      <input
                        type="date"
                        className="input-control font-mono"
                        value={remDate}
                        onChange={(e) => setRemDate(e.target.value)}
                      />
                    </div>
                    <div className="input-group mb-0">
                      <label className="input-label">Time</label>
                      <input
                        type="time"
                        className="input-control font-mono"
                        value={remTime}
                        onChange={(e) => setRemTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="input-group mt-3 mb-0">
                    <label className="input-label">Meeting URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://teams.microsoft.com/... or https://meet.google.com/..."
                      className="input-control"
                      value={remLink}
                      onChange={(e) => setRemLink(e.target.value)}
                    />
                  </div>
                  <div className="text-right mt-3">
                    <button
                      type="button"
                      onClick={handleCreateReminderInModal}
                      className="btn btn-sm btn-primary"
                    >
                      <CalendarPlus size={13} /> Save Reminder
                    </button>
                  </div>
                </div>
              )}

              {/* List of existing reminders */}
              {(editingJob.reminders || []).map(r => (
                <div key={r.id} className="modal-reminder-item glass-panel">
                  <div className="modal-reminder-left">
                    <span className="badge badge-purple">{r.type}</span>
                    <span className="font-mono text-xs">{r.date} at {r.time || '10:00'}</span>
                    <span className="text-sm font-semibold">{r.title}</span>
                  </div>
                  <div className="modal-reminder-right">
                    <a
                      href={getGoogleCalendarUrl({ ...r, company: editingJob.company, role: editingJob.role })}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline text-purple"
                      title="Add to Google Calendar"
                    >
                      <CalendarPlus size={13} /> +Google Cal
                    </a>
                    <button
                      type="button"
                      onClick={() => downloadEventIcs({ ...r, company: editingJob.company, role: editingJob.role })}
                      className="btn btn-sm btn-outline"
                      title="Download .ics"
                    >
                      .ics
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReminder(editingJob.id, r.id)}
                      className="btn btn-sm btn-outline text-danger"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Progression History */}
          {isEditing && editingJob.history && editingJob.history.length > 0 && (
            <div className="timeline-section">
              <h4 className="section-subtitle">
                <History size={14} className="text-muted" />
                <span>Stage Progression History</span>
              </h4>
              <div className="timeline-items">
                {editingJob.history.map((h, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-date font-mono">{h.date}</span>
                      <span className="timeline-stage badge badge-subtle">{h.stage}</span>
                      <p className="timeline-note">{h.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Bottom Actions */}
          <div className="modal-footer">
            {isEditing && (
              <button
                type="button"
                className="btn btn-danger mr-auto"
                onClick={() => {
                  if (window.confirm(`Delete ${editingJob.company} (${editingJob.role})?`)) {
                    deleteJob(editingJob.id);
                    closeModal();
                  }
                }}
              >
                <Trash2 size={16} /> Delete Application
              </button>
            )}

            <button type="button" className="btn btn-outline" onClick={closeModal}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              {isEditing ? 'Save Changes' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
