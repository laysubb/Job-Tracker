import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { STATUS_COLUMNS } from '../data/seedJobs';
import KanbanCard from './KanbanCard';
import { Plus } from 'lucide-react';

export default function KanbanBoard() {
  const { filteredJobs, updateJobStatus, openCreateModal } = useJobs();
  const [activeDropCol, setActiveDropCol] = useState(null);

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    setActiveDropCol(colId);
  };

  const handleDragLeave = () => {
    setActiveDropCol(null);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setActiveDropCol(null);
    const jobId = e.dataTransfer.getData('text/plain');
    if (jobId) {
      updateJobStatus(jobId, colId);
    }
  };

  return (
    <div className="kanban-wrapper">
      <div className="kanban-board">
        {STATUS_COLUMNS.map((col) => {
          const colJobs = filteredJobs.filter((j) => j.status === col.id);
          const isDropActive = activeDropCol === col.id;

          return (
            <div
              key={col.id}
              className={`kanban-column glass-panel ${isDropActive ? 'drop-target' : ''}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="column-header">
                <div className="column-header-left">
                  <span
                    className="column-dot"
                    style={{ backgroundColor: col.color }}
                  ></span>
                  <h3 className="column-title">{col.label}</h3>
                  <span
                    className="column-count-badge"
                    style={{ color: col.color, backgroundColor: col.bg }}
                  >
                    {colJobs.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="column-cards-container">
                {colJobs.length === 0 ? (
                  <div className="column-empty-state">
                    <span>No applications</span>
                  </div>
                ) : (
                  colJobs.map((job) => (
                    <KanbanCard key={job.id} job={job} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
