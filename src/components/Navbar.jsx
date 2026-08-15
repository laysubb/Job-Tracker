import React, { useRef } from 'react';
import { useJobs } from '../context/JobContext';
import {
  Briefcase,
  Kanban,
  Table as TableIcon,
  GitFork,
  Calendar,
  Plus,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { CATEGORIES } from '../data/seedJobs';

export default function Navbar() {
  const {
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
    allReminders
  } = useJobs();

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importDataFromJson(file);
      e.target.value = '';
    }
  };

  const upcomingCount = allReminders.filter(r => new Date(`${r.date}T${r.time || '23:59'}`) >= new Date()).length;

  return (
    <header className="navbar glass-panel">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-icon">
            <Briefcase size={22} className="text-white" />
          </div>
          <div>
            <h1 className="brand-title">CareerPulse</h1>
            <p className="brand-subtitle">Job Pipeline & Sankey Tracker</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="view-tabs">
          <button
            className={`tab-btn ${activeTab === 'kanban' ? 'active' : ''}`}
            onClick={() => setActiveTab('kanban')}
          >
            <Kanban size={16} />
            <span>Kanban Pipeline</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'table' ? 'active' : ''}`}
            onClick={() => setActiveTab('table')}
          >
            <TableIcon size={16} />
            <span>Data Grid</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'sankey' ? 'active' : ''}`}
            onClick={() => setActiveTab('sankey')}
          >
            <GitFork size={16} />
            <span>Sankey Studio</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'reminders' ? 'active' : ''}`}
            onClick={() => setActiveTab('reminders')}
          >
            <Calendar size={16} />
            <span>Calendar Reminders</span>
            {upcomingCount > 0 && (
              <span className="reminder-badge">{upcomingCount}</span>
            )}
          </button>
        </nav>

        {/* Global Actions */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            className="btn btn-outline btn-icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Backup dropdown / Actions */}
          <div className="dropdown">
            <button className="btn btn-outline" title="Data Backup & Export">
              <Download size={13} />
              <span className="hidden-mobile">Backup</span>
            </button>
            <div className="dropdown-menu">
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
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={18} />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar for Kanban and Table */}
      {(activeTab === 'kanban' || activeTab === 'table') && (
        <div className="filter-bar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
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
              <SlidersHorizontal size={14} className="select-icon" />
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
    </header>
  );
}
