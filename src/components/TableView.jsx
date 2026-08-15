import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { STATUS_COLUMNS } from '../data/seedJobs';
import { 
  ExternalLink, 
  Calendar, 
  CalendarPlus,
  Edit3, 
  Trash2, 
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { getGoogleCalendarUrl, downloadEventIcs } from '../utils/calendarExport';

export default function TableView() {
  const { filteredJobs, updateJobStatus, openEditModal, deleteJob } = useJobs();
  const [sortField, setSortField] = useState('appliedDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (statusId) => {
    const col = STATUS_COLUMNS.find(c => c.id === statusId) || STATUS_COLUMNS[0];
    return col;
  };

  return (
    <div className="table-wrapper glass-panel">
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('company')} className="sortable-th">
                <div className="th-content">Company <ArrowUpDown size={13} /></div>
              </th>
              <th onClick={() => handleSort('role')} className="sortable-th">
                <div className="th-content">Role <ArrowUpDown size={13} /></div>
              </th>
              <th onClick={() => handleSort('category')} className="sortable-th">
                <div className="th-content">Category <ArrowUpDown size={13} /></div>
              </th>
              <th onClick={() => handleSort('status')} className="sortable-th">
                <div className="th-content">Status <ArrowUpDown size={13} /></div>
              </th>
              <th onClick={() => handleSort('appliedDate')} className="sortable-th">
                <div className="th-content">Applied Date <ArrowUpDown size={13} /></div>
              </th>
              <th>Next Reminder / Interview</th>
              <th>Portal Link</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedJobs.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-muted">
                  No job applications found matching your criteria.
                </td>
              </tr>
            ) : (
              sortedJobs.map((job) => {
                const statusMeta = getStatusBadge(job.status);
                const firstReminder = job.reminders && job.reminders.length > 0 ? job.reminders[0] : null;

                return (
                  <tr key={job.id} className="table-row">
                    {/* Company */}
                    <td className="font-semibold text-primary">
                      {job.company}
                    </td>

                    {/* Role */}
                    <td>
                      <div className="role-cell">
                        <span className="role-title">{job.role}</span>
                        {job.programType && (
                          <span className="badge badge-subtle">{job.programType}</span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="tag tag-category">{job.category}</span>
                    </td>

                    {/* Status with inline changer */}
                    <td>
                      <select
                        className="table-status-select"
                        style={{
                          color: statusMeta.color,
                          backgroundColor: statusMeta.bg,
                          borderColor: statusMeta.border
                        }}
                        value={job.status}
                        onChange={(e) => updateJobStatus(job.id, e.target.value)}
                      >
                        {STATUS_COLUMNS.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Applied Date */}
                    <td className="text-secondary font-mono text-xs">
                      {job.appliedDate}
                    </td>

                    {/* Next Reminder / Calendar Export */}
                    <td>
                      {firstReminder ? (
                        <div className="table-reminder-cell">
                          <span className="reminder-text" title={firstReminder.title}>
                            {firstReminder.date} ({firstReminder.type || 'Event'})
                          </span>
                          <div className="calendar-quick-actions">
                            <a
                              href={getGoogleCalendarUrl({ ...firstReminder, company: job.company, role: job.role })}
                              target="_blank"
                              rel="noreferrer"
                              className="table-cal-btn text-purple"
                              title="Add to Google Calendar"
                            >
                              <CalendarPlus size={13} />
                            </a>
                            <button
                              onClick={() => downloadEventIcs({ ...firstReminder, company: job.company, role: job.role })}
                              className="table-cal-btn"
                              title="Download .ics file"
                            >
                              <Calendar size={13} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>

                    {/* Portal Link */}
                    <td>
                      {job.portalUrl ? (
                        <a
                          href={job.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="table-portal-link"
                          title="Open Application Portal"
                        >
                          <span>Portal</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-right">
                      <div className="table-action-group">
                        <button
                          onClick={() => openEditModal(job)}
                          className="btn btn-outline btn-icon btn-sm"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${job.company} (${job.role})?`)) {
                              deleteJob(job.id);
                            }
                          }}
                          className="btn btn-outline btn-icon btn-sm text-danger"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
