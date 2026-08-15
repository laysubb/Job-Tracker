import React from 'react';
import { JobProvider, useJobs } from './context/JobContext';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';
import KanbanBoard from './components/KanbanBoard';
import TableView from './components/TableView';
import SankeyView from './components/SankeyView';
import RemindersView from './components/RemindersView';
import JobModal from './components/JobModal';
import './App.css';

function MainApp() {
  const { activeTab } = useJobs();

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        {/* Top KPI Metric Cards */}
        <StatsSummary />

        {/* Dynamic Views */}
        {activeTab === 'kanban' && <KanbanBoard />}
        {activeTab === 'table' && <TableView />}
        {activeTab === 'sankey' && <SankeyView />}
        {activeTab === 'reminders' && <RemindersView />}
      </main>

      {/* Global Application Detail / Add Modal */}
      <JobModal />
    </div>
  );
}

export default function App() {
  return (
    <JobProvider>
      <MainApp />
    </JobProvider>
  );
}
