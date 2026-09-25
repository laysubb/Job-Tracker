import React from 'react';
import { JobProvider, useJobs } from './context/JobContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';
import KanbanBoard from './components/KanbanBoard';
import TableView from './components/TableView';
import SankeyView from './components/SankeyView';
import RemindersView from './components/RemindersView';
import UserProfileView from './components/UserProfileView';
import JobModal from './components/JobModal';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function MainApp() {
  const { activeTab, isSidebarOpen, setIsSidebarOpen } = useJobs();

  return (
    <div className={`app-layout ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="app-main-area">
        <Navbar />
        
        <main className="main-content">
          {/* Top KPI Metric Cards (shown on pipeline/tracker views) */}
          {activeTab !== 'profile' && <StatsSummary />}

          {/* Dynamic Views */}
          {activeTab === 'kanban' && <KanbanBoard />}
          {activeTab === 'table' && <TableView />}
          {activeTab === 'sankey' && <SankeyView />}
          {activeTab === 'reminders' && <RemindersView />}
          {activeTab === 'profile' && <UserProfileView />}
        </main>
      </div>

      {/* Global Application Detail / Add Modal */}
      <JobModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      
      <JobProvider>
        <MainApp />
      </JobProvider>
    </AuthProvider>
  );
}
