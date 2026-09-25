import React from 'react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Kanban,
  Table as TableIcon,
  GitFork,
  Calendar,
  User,
  PanelLeftClose,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    allReminders,
    isSidebarOpen,
    toggleSidebar,
    jobs,
    openCreateModal
  } = useJobs();
  const { user } = useAuth();

  const upcomingCount = allReminders.filter(
    r => new Date(`${r.date}T${r.time || '23:59'}`) >= new Date()
  ).length;

  const navItems = [
    {
      id: 'kanban',
      label: 'Kanban Pipeline',
      shortLabel: 'Kanban',
      icon: Kanban,
      badge: null
    },
    {
      id: 'table',
      label: 'Data Grid',
      shortLabel: 'Table',
      icon: TableIcon,
      badge: null
    },
    {
      id: 'sankey',
      label: 'Sankey Studio',
      shortLabel: 'Sankey',
      icon: GitFork,
      badge: null
    },
    {
      id: 'reminders',
      label: 'Calendar Reminders',
      shortLabel: 'Calendar',
      icon: Calendar,
      badge: upcomingCount > 0 ? upcomingCount : null
    },
    {
      id: 'profile',
      label: 'Profile & Settings',
      shortLabel: 'Profile',
      icon: User,
      badge: null
    }
  ];

  return (
    <aside className={`app-sidebar glass-panel ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
      {/* Sidebar Header / Brand */}
      <div className={`sidebar-header ${!isSidebarOpen ? 'header-collapsed' : ''}`}>
        {isSidebarOpen ? (
          <>
            <div
              className="sidebar-brand"
              onClick={() => setActiveTab('kanban')}
              title="CareerPulse Home"
            >
              <div className="sidebar-brand-icon">
                <Briefcase size={20} className="text-white" />
              </div>
              <div className="sidebar-brand-text">
                <h1 className="sidebar-title">CareerPulse</h1>
                <p className="sidebar-subtitle">Job Pipeline Tracker</p>
              </div>
            </div>

            <button
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          </>
        ) : (
          <button
            className="sidebar-brand-collapsed-btn"
            onClick={toggleSidebar}
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <div className="sidebar-brand-icon bag-icon-pulse">
              <Briefcase size={20} className="text-white" />
            </div>
          </button>
        )}
      </div>

      {/* Quick Add CTA in Sidebar (when expanded) */}
      {isSidebarOpen && (
        <div className="sidebar-quick-action">
          <button
            className="btn btn-primary sidebar-add-btn"
            onClick={openCreateModal}
          >
            <Plus size={16} />
            <span>New Application</span>
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-section-label">
          {isSidebarOpen ? 'NAVIGATION' : '•'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={!isSidebarOpen ? item.label : undefined}
            >
              <div className="sidebar-icon-wrapper">
                <Icon size={18} />
              </div>
              {isSidebarOpen && (
                <span className="sidebar-nav-label">{item.label}</span>
              )}
              {item.badge !== null && (
                <span className={`sidebar-badge ${!isSidebarOpen ? 'badge-dot-only' : ''}`}>
                  {isSidebarOpen ? item.badge : ''}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {isSidebarOpen ? (
          <div className="sidebar-footer-card">
            <div className="sidebar-footer-stats">
              <span className="footer-stats-count">{jobs.length}</span>
              <span className="footer-stats-label">Tracked Applications</span>
            </div>
            {user && (
              <div className="sidebar-footer-user" onClick={() => setActiveTab('profile')}>
                <div className="sidebar-user-avatar">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="sidebar-user-info">
                  <span className="sidebar-user-email" title={user.email}>{user.email}</span>
                  <span className="sidebar-user-status">Online</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            className="sidebar-expand-bottom-btn"
            onClick={toggleSidebar}
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
