import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X } from 'lucide-react';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content logout-confirm-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="logout-modal-header">
          <div className="logout-icon-badge">
            <LogOut size={24} />
          </div>
          <h3>Confirm Log Out</h3>
          <p className="logout-modal-text">
            Are you sure you want to log out? You will need to sign in again to access your job applications.
          </p>
        </div>

        <div className="logout-modal-actions">
          <button type="button" className="btn btn-secondary flex-1" onClick={onClose}>
            No, Cancel
          </button>
          <button type="button" className="btn btn-danger flex-1" onClick={onConfirm}>
            <LogOut size={16} />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
