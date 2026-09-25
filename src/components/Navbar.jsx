import React, { useState, useRef } from 'react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import LogoutConfirmModal from './LogoutConfirmModal';
import ExportTextModal from './ExportTextModal';
import {
  Briefcase,
  Plus,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Search,
  SlidersHorizontal,
  LogIn,
  LogOut,
  User,
  FileText,
  PanelLeft
} from 'lucide-react';
import { CATEGORIES } from '../data/seedJobs';

const TAB_LABELS = {
  kanban: 'Kanban Pipeline',
  table: 'Data Grid',
  sankey: 'Sankey Studio',
  reminders: 'Calendar Reminders',
  profile: 'Profile & Settings'
};

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const {
    jobs,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    openCreateModal,
    exportDataAsJson,
    exportDataAsCsv,
    importDataFromJson,
    resetToDefaultData,
    isSidebarOpen,
    toggleSidebar
  } = useJobs();

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importDataFromJson(file);
      e.target.value = '';
    }
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    await signOut();
    setActiveTab('kanban');
  };

  return (
    <header className="navbar glass-panel">
      <div className="navbar-container">
        {/* Navbar Left: Sidebar Toggle & Page Title */}
        <div className="navbar-left">
          <button
            className="btn btn-outline btn-icon sidebar-toggle-top-btn"
            onClick={toggleSidebar}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Open navigation sidebar'}
            aria-label="Toggle navigation sidebar"
          >
            {!isSidebarOpen ? (
              <Briefcase size={18} className="text-primary" />
            ) : (
              <PanelLeft size={18} />
            )}
          </button>

          <div className="navbar-view-info">
            <h2 className="navbar-page-title">{TAB_LABELS[activeTab] || 'Job Pipeline'}</h2>
          </div>
        </div>

        {/* Filter / Search Bar (Center) for Kanban and Table */}
        {(activeTab === 'kanban' || activeTab === 'table') && (
          <div className="navbar-search-section">
            <div className="search-box">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search companies, roles, tags, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm('')}>×</button>
              )}
            </div>

            <div className="filter-selects">
              <div className="select-wrapper">
                <SlidersHorizontal size={13} className="select-icon" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Global Actions - Aligned to the Right */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            className="btn btn-outline btn-icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Export All Jobs Button (Beside Backup button) */}
          <button
            className="btn btn-outline export-all-jobs-btn"
            onClick={() => setIsExportModalOpen(true)}
            title="Extract Jobs in text form"
          >
            <FileText size={15} />
            <span>Export All Jobs</span>
          </button>

          {/* Backup dropdown / Actions */}
          <div className="dropdown">
            <button className="btn btn-outline" title="Data Backup & Export">
              <Download size={14} />
              <span className="hidden-mobile">Backup</span>
            </button>
            <div className="dropdown-menu">
              <button onClick={() => setIsExportModalOpen(true)} className="dropdown-item" title="Extract Jobs in text form">
                <FileText size={14} /> Export All Jobs (.TXT)
              </button>
              <button onClick={exportDataAsJson} className="dropdown-item">
                <Download size={14} /> Export Backup (.JSON)
              </button>
              <button onClick={exportDataAsCsv} className="dropdown-item">
                <Download size={14} /> Export Spreadsheet (.CSV)
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="dropdown-item">
                <Upload size={14} /> Restore / Import (.JSON)
              </button>
              <div className="dropdown-divider"></div>
              <button onClick={resetToDefaultData} className="dropdown-item text-danger">
                <RotateCcw size={14} /> Reset to 14 Seed Jobs
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".json"
              onChange={handleFileUpload}
            />
          </div>

          {/* New Application CTA */}
          <button
            className="btn btn-primary"
            onClick={user ? openCreateModal : () => setIsAuthOpen(true)}
          >
            <Plus size={16} />
            <span>Add Application</span>
          </button>

          {/* User Auth Profile / Login Button (Far Right) */}
          {user ? (
            <div className={`user-profile-badge ${activeTab === 'profile' ? 'active' : ''}`}>
              <button
                className="user-profile-trigger-btn"
                onClick={() => setActiveTab('profile')}
                title="View Profile & Settings"
              >
                <div className="user-avatar-circle">
                  {user.email ? user.email.charAt(0).toUpperCase() : <User size={14} />}
                </div>
                <span className="user-email-text hidden-mobile">{user.email}</span>
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="btn btn-outline btn-icon logout-icon-btn"
                title="Log Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-outline"
              onClick={() => setIsAuthOpen(true)}
              title="Sign In / Register"
            >
              <LogIn size={15} />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>

      {/* Export All Jobs Text Modal */}
      <ExportTextModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        jobs={jobs}
      />

      {/* Auth Modal for Login / Signup / Reset Password */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </header>
  );
}
