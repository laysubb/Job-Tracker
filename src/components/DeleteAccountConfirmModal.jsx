import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

export default function DeleteAccountConfirmModal({ isOpen, onClose, onConfirm, userEmail }) {
  const [submitting, setSubmitting] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  const isConfirmed = confirmInput.trim().toLowerCase() === 'delete';

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-confirm-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close" disabled={submitting}>
          <X size={18} />
        </button>

        <div className="delete-modal-header">
          <div className="delete-icon-badge">
            <AlertTriangle size={26} />
          </div>
          <h3>Delete Account?</h3>
          <p className="delete-modal-text">
            This action is <strong>permanent</strong> and <strong>irreversible</strong>.
            All your tracked applications, interview notes, and calendar reminders associated with{' '}
            <span className="text-danger">{userEmail}</span> will be erased.
          </p>
        </div>

        <div className="delete-input-group">
          <label className="delete-input-label">
            Type <strong>DELETE</strong> to confirm:
          </label>
          <input
            type="text"
            placeholder="DELETE"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            className="auth-input delete-input"
            disabled={submitting}
            autoFocus
          />
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn btn-secondary flex-1"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger flex-1"
            onClick={handleConfirm}
            disabled={!isConfirmed || submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Permanently Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
