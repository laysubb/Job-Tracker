import React from 'react';
import { useJobs } from '../context/JobContext';
import {
  ExternalLink,
  Calendar,
  MoreVertical,
  ChevronRight,
  Trash2,
  Edit3,
  FileText,
  Clock,
  ArrowRightCircle
} from 'lucide-react';
import { STATUS_COLUMNS } from '../data/seedJobs';

export default function KanbanCard({ job }) {
  const { openEditModal, updateJobStatus, deleteJob } = useJobs();

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', job.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getCompanyColor = (name) => {
    const colors = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#f43f5e'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const companyColor = getCompanyColor(job.company || 'Job');
  const initial = (job.company || 'J').charAt(0).toUpperCase();

  // Find current status index to suggest next logical stage
  const currentIndex = STATUS_COLUMNS.findIndex(c => c.id === job.status);
  const nextStage = currentIndex >= 0 && currentIndex < 5 ? STATUS_COLUMNS[currentIndex + 1] : null;

  return (
    <div
      className="kanban-card glass-panel"
      draggable
      onDragStart={handleDragStart}
      onClick={() => openEditModal(job)}
    >
      <div className="card-top-row">
        <div className="company-badge-group">
          <div
            className="company-avatar"
            style={{ backgroundColor: companyColor }}
          >
            {initial}
          </div>
          <div>
            <h4 className="company-name">{job.company}</h4>
            <span className="card-applied-date">
              <Clock size={11} /> {job.appliedDate}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="card-top-actions" onClick={(e) => e.stopPropagation()}>
          {job.portalUrl && (
            <a
              href={job.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="card-icon-link"
              title="Open Job Application Portal"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <button
            className="card-icon-btn"
            onClick={() => openEditModal(job)}
            title="Edit Application"
          >
            <Edit3 size={14} />
          </button>
        </div>
      </div>

      {/* Role Title */}
      <h3 className="job-role-title" title={job.role}>{job.role}</h3>

      {/* Tags */}
      <div className="card-tags">
        {job.category && (
          <span className="tag tag-category">{job.category}</span>
        )}
        {/* {job.programType && (
          <span className="tag tag-program">{job.programType}</span>
        )} */}
        {job.resumeVersion && (
          <span className="tag tag-resume" title={`Resume: ${job.resumeVersion}`}>
            <FileText size={11} /> {job.resumeVersion.replace('.pdf', '')}
          </span>
        )}
      </div>

      {/* Reminders / Next Step Notification */}
      {job.reminders && job.reminders.length > 0 && (
        <div className="card-reminder-pill" onClick={(e) => { e.stopPropagation(); openEditModal(job); }}>
          <Calendar size={12} />
          <span>{job.reminders[0].title} ({job.reminders[0].date})</span>
        </div>
      )}

      {/* Card Footer with Quick Move */}
      <div className="card-footer" onClick={(e) => e.stopPropagation()}>
        {/* Quick advance button */}
        {nextStage && (
          <button
            className="quick-advance-btn"
            onClick={() => updateJobStatus(job.id, nextStage.id)}
            title={`Advance to ${nextStage.label}`}
          >
            <span>Advance</span>
            <ChevronRight size={13} />
          </button>
        )}

        {/* Change status selector */}
        <select
          className="stage-selector"
          value={job.status}
          onChange={(e) => updateJobStatus(job.id, e.target.value)}
          title="Change Status"
        >
          {STATUS_COLUMNS.map(col => (
            <option key={col.id} value={col.id}>
              {col.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
