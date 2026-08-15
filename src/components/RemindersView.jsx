import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  Calendar, 
  CalendarPlus, 
  Clock, 
  Download, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Building, 
  AlertCircle,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { 
  getGoogleCalendarUrl, 
  downloadEventIcs, 
  downloadBulkIcs 
} from '../utils/calendarExport';

export default function RemindersView() {
  const { jobs, allReminders, addReminder, deleteReminder } = useJobs();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [type, setType] = useState('Online Assessment');
  const [locationOrLink, setLocationOrLink] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!selectedJobId) return;

    addReminder(selectedJobId, {
      title: title || `${type} for ${jobs.find(j => j.id === selectedJobId)?.company}`,
      date,
      time,
      durationMinutes: Number(durationMinutes),
      type,
      locationOrLink,
      notes
    });

    // Reset
    setTitle('');
    setLocationOrLink('');
    setNotes('');
    setShowAddForm(false);
  };

  const now = new Date();
  const upcomingReminders = allReminders.filter(r => new Date(`${r.date}T${r.time || '23:59'}`) >= now);
  const pastReminders = allReminders.filter(r => new Date(`${r.date}T${r.time || '23:59'}`) < now);

  return (
    <div className="reminders-page">
      {/* Top Banner */}
      <div className="reminders-header glass-panel">
        <div>
          <div className="reminders-title-group">
            <h2 className="reminders-heading">Calendar Reminders & Deadlines</h2>
            <span className="badge badge-purple">
              <CalendarCheck size={12} /> Sync with Google Calendar
            </span>
          </div>
          <p className="reminders-subtitle">
            Export upcoming interviews, OA deadlines, and tests directly into Google Calendar, Outlook, or Apple Calendar using standard <strong>.ics</strong> files.
          </p>
        </div>

        <div className="reminders-top-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => downloadBulkIcs(allReminders)}
            disabled={allReminders.length === 0}
            title="Download all deadlines into a single .ics file"
          >
            <Download size={16} />
            <span>Download All (.ics)</span>
          </button>

          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Cancel' : 'Schedule Deadline'}</span>
          </button>
        </div>
      </div>

      {/* Add New Deadline Drawer/Form */}
      {showAddForm && (
        <form onSubmit={handleAddReminder} className="reminder-add-form glass-panel animate-fade-in">
          <h3 className="form-section-title">Schedule New Deadline / Interview</h3>
          
          <div className="form-grid-3">
            <div className="input-group">
              <label className="input-label">Select Company / Job Application *</label>
              <select 
                className="input-control"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                required
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.company} — {j.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Event / Deadline Type</label>
              <select 
                className="input-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Online Assessment">Online Assessment / OA</option>
                <option value="1st Round Interview">1st Round HR / Screening</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="Case Interview">Case Study / Take-Home</option>
                <option value="Final Round">Final Round / Partner</option>
                <option value="Follow-up Reminder">Follow-up Email</option>
                <option value="Offer Decision Deadline">Offer Acceptance Deadline</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Event Title (Optional)</label>
              <input 
                type="text"
                placeholder="e.g. Shopee GDP Hackerrank Test"
                className="input-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="input-group">
              <label className="input-label">Date *</label>
              <input 
                type="date"
                className="input-control font-mono"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Time</label>
              <input 
                type="time"
                className="input-control font-mono"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Duration (Minutes)</label>
              <input 
                type="number"
                min="15"
                step="15"
                className="input-control"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Meeting URL / Test Portal Link</label>
            <input 
              type="url"
              placeholder="e.g. https://meet.google.com/xyz or https://hackerrank.com/..."
              className="input-control"
              value={locationOrLink}
              onChange={(e) => setLocationOrLink(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Prep Notes / Key Topics</label>
            <textarea 
              placeholder="e.g. Review STAR stories, system design microservices, DP problems..."
              className="input-control"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CalendarPlus size={16} />
              Save Deadline
            </button>
          </div>
        </form>
      )}

      {/* Upcoming Reminders Section */}
      <div className="reminders-section">
        <h3 className="section-title">
          <Clock size={16} className="text-cyan" />
          <span>Upcoming Events & Deadlines ({upcomingReminders.length})</span>
        </h3>

        {upcomingReminders.length === 0 ? (
          <div className="empty-reminders glass-panel">
            <Calendar size={36} className="text-muted mb-2" />
            <p className="text-secondary font-medium">No upcoming deadlines scheduled</p>
            <p className="text-muted text-xs">Click "Schedule Deadline" to add an interview or OA date.</p>
          </div>
        ) : (
          <div className="reminders-list">
            {upcomingReminders.map(rem => (
              <div key={rem.id} className="reminder-card glass-panel animate-fade-in">
                <div className="reminder-card-left">
                  <div className="date-block">
                    <span className="date-month">
                      {new Date(rem.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </span>
                    <span className="date-day font-mono font-bold">
                      {rem.date.split('-')[2]}
                    </span>
                    <span className="date-time font-mono">
                      {rem.time || '10:00'}
                    </span>
                  </div>

                  <div className="reminder-details">
                    <div className="reminder-company-row">
                      <span className="badge badge-purple">{rem.type}</span>
                      <h4 className="reminder-company-title">
                        <Building size={14} className="text-muted" />
                        {rem.company}
                      </h4>
                    </div>
                    <h3 className="reminder-event-title">{rem.title}</h3>
                    <p className="reminder-role-text text-secondary text-xs">Role: {rem.role}</p>
                    
                    {rem.locationOrLink && (
                      <a 
                        href={rem.locationOrLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="meeting-link"
                      >
                        <ExternalLink size={13} />
                        <span>Meeting / Portal Link</span>
                      </a>
                    )}

                    {rem.notes && (
                      <p className="reminder-notes">
                        <strong>Prep Note:</strong> {rem.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="reminder-card-actions">
                  <a
                    href={getGoogleCalendarUrl(rem)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-primary"
                    title="Add to Google Calendar (Browser)"
                  >
                    <CalendarPlus size={14} />
                    <span>+ Google Cal</span>
                  </a>

                  <button
                    onClick={() => downloadEventIcs(rem)}
                    className="btn btn-sm btn-outline"
                    title="Download RFC 5545 .ics Calendar File"
                  >
                    <Download size={14} />
                    <span>Download .ics</span>
                  </button>

                  <button
                    onClick={() => deleteReminder(rem.jobId, rem.id)}
                    className="btn btn-sm btn-outline text-danger"
                    title="Delete Reminder"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Reminders Section */}
      {pastReminders.length > 0 && (
        <div className="reminders-section mt-8">
          <h3 className="section-title text-muted">
            <CheckCircle2 size={16} />
            <span>Past Events ({pastReminders.length})</span>
          </h3>
          <div className="reminders-list opacity-70">
            {pastReminders.map(rem => (
              <div key={rem.id} className="reminder-card glass-panel">
                <div className="reminder-card-left">
                  <div className="date-block bg-muted">
                    <span className="date-month">
                      {new Date(rem.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </span>
                    <span className="date-day font-mono font-bold">
                      {rem.date.split('-')[2]}
                    </span>
                  </div>
                  <div className="reminder-details">
                    <span className="badge badge-subtle">{rem.type}</span>
                    <h4 className="reminder-event-title">{rem.title} — {rem.company}</h4>
                    <p className="text-muted text-xs">Completed on {rem.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(rem.jobId, rem.id)}
                  className="btn btn-sm btn-outline text-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
