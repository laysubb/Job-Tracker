import React from 'react';
import { useJobs } from '../context/JobContext';
import { 
  Send, 
  Activity, 
  Users, 
  Trophy, 
  CalendarClock, 
  ExternalLink,
  CalendarPlus
} from 'lucide-react';
import { getGoogleCalendarUrl, downloadEventIcs } from '../utils/calendarExport';

export default function StatsSummary() {
  const { jobs, allReminders, setActiveTab } = useJobs();

  const totalApplied = jobs.length;
  const activeCount = jobs.filter(j => 
    ['applied', 'assessment', 'first_interview', 'second_interview', 'final_round'].includes(j.status)
  ).length;

  const interviewCount = jobs.filter(j => 
    ['first_interview', 'second_interview', 'final_round', 'offer', 'accepted', 'declined'].includes(j.status) ||
    (j.history || []).some(h => ['first_interview', 'second_interview', 'final_round'].includes(h.stage))
  ).length;

  const offerCount = jobs.filter(j => ['offer', 'accepted'].includes(j.status)).length;
  
  const responseRate = totalApplied > 0 
    ? Math.round(((totalApplied - jobs.filter(j => j.status === 'applied').length) / totalApplied) * 100) 
    : 0;

  // Next closest reminder
  const now = new Date();
  const nextReminder = allReminders.find(r => new Date(`${r.date}T${r.time || '23:59'}`) >= now);

  return (
    <div>
      <div className= "reminder">
               {/* Next Upcoming Reminder Card */}
        {nextReminder ? (
          <div className="stat-card glass-panel reminder-highlight-card">
            <div className="stat-icon-wrapper bg-purple">
              <CalendarClock size={20} className="text-purple" />
            </div>
            <div className="stat-info flex-1">
              <div className="flex-between">
                <span className="stat-label">Next Deadline / Interview</span>
                <span className="badge badge-purple">{nextReminder.date}</span>
              </div>
              <p className="next-event-title" title={nextReminder.title}>
                <strong>{nextReminder.company}</strong> — {nextReminder.title}
              </p>
              <div className="stat-actions">
                <a
                  href={getGoogleCalendarUrl(nextReminder)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline text-purple"
                  title="Add to Google Calendar"
                >
                  <CalendarPlus size={13} /> +Google Cal
                </a>
                <button
                  onClick={() => downloadEventIcs(nextReminder)}
                  className="btn btn-sm btn-outline"
                  title="Download .ics file"
                >
                  .ics
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="stat-card glass-panel empty-reminder-card" onClick={() => setActiveTab('reminders')}>
            <div className="stat-icon-wrapper bg-muted">
              <CalendarClock size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Upcoming Deadlines</span>
              <p className="stat-subtext">No upcoming deadlines scheduled</p>
            </div>
          </div>
        )}
      </div>
      <div className="stats-grid">
    
        {/* Total Applications */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper bg-indigo">
            <Send size={20} className="text-indigo" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Applied</span>
            <div className="stat-value-group">
              <span className="stat-value">{totalApplied}</span>
              <span className="stat-subtext">applications</span>
            </div>
          </div>
        </div>

        {/* Active in Pipeline */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper bg-cyan">
            <Activity size={20} className="text-cyan" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Pipeline</span>
            <div className="stat-value-group">
              <span className="stat-value text-cyan">{activeCount}</span>
              <span className="stat-subtext">in progress</span>
            </div>
          </div>
        </div>

        {/* Reached Interviews */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper bg-amber">
            <Users size={20} className="text-amber" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Interview Conversion</span>
            <div className="stat-value-group">
              <span className="stat-value text-amber">{interviewCount}</span>
              <span className="stat-subtext">({responseRate}% activity)</span>
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper bg-emerald">
            <Trophy size={20} className="text-emerald" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Offers Landed</span>
            <div className="stat-value-group">
              <span className="stat-value text-emerald">{offerCount}</span>
              <span className="stat-subtext">offers</span>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
