import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Copy, Check, Download, X } from 'lucide-react';
import { formatJobsAsText, downloadTextFile } from '../utils/textExport';

export default function ExportTextModal({ isOpen, onClose, jobs = [] }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const formattedText = formatJobsAsText(jobs);
  const totalCount = jobs.length;

  const handleCopy = async () => {
    if (!formattedText) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(formattedText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = formattedText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    if (!formattedText) return;
    downloadTextFile(formattedText, `careerpulse_jobs_export_${new Date().toISOString().split('T')[0]}.txt`);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content export-text-modal glass-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="export-modal-title-group">
            <div className="export-icon-badge">
              <FileText size={22} className="text-primary" />
            </div>
            <div>
              <h2 id="export-modal-title" className="modal-title">Export All Jobs</h2>
              <p className="modal-subtitle">
                Ascending order (earliest to latest applied) in plain text format
              </p>
            </div>
          </div>
          {totalCount > 0 && (
            <span className="badge badge-purple export-count-badge">
              {totalCount} {totalCount === 1 ? 'Job' : 'Jobs'}
            </span>
          )}
        </div>

        <div className="modal-body export-text-body">
          {totalCount === 0 ? (
            <div className="export-empty-state">
              <FileText size={40} className="text-muted mb-2" />
              <p className="text-muted">No job applications found to export.</p>
            </div>
          ) : (
            <div className="export-preview-container">
              <div className="export-preview-header">
                <span className="export-preview-label">Formatted Plain Text Preview:</span>
                <span className="export-preview-subtext">Click Copy or Download below</span>
              </div>
              <textarea
                className="export-text-area font-mono"
                readOnly
                value={formattedText}
                rows={Math.min(15, Math.max(8, totalCount + 2))}
                onClick={(e) => e.target.select()}
                title="Select all text"
              />
            </div>
          )}
        </div>

        <div className="modal-footer export-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {totalCount > 0 && (
            <>
              <button
                type="button"
                className={`btn ${copied ? 'btn-success' : 'btn-outline'}`}
                onClick={handleCopy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDownload}
              >
                <Download size={16} />
                <span>Download .TXT</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
