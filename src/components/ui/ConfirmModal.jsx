import { useEffect, useRef } from 'react';

/**
 * ConfirmModal — Enterprise-grade confirmation dialog.
 * 
 * Cold Surgical design: sharp geometry, hairline borders, no shadows,
 * monospace labels, editorial body text.
 * 
 * Features:
 * - ESC to close
 * - Click-outside to close  
 * - Auto-focus on cancel button (safe default)
 * - Keyboard accessible (Tab navigation)
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Called when modal is dismissed
 * @param {function} onConfirm - Called when action is confirmed
 * @param {string} title - Monospace overline title (uppercase)
 * @param {string} description - Editorial body description
 * @param {string} [confirmLabel='CONFIRM'] - Label for confirm button
 * @param {string} [variant='danger'] - 'danger' or 'neutral'
 */
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmLabel = 'CONFIRM',
  variant = 'danger'
}) => {
  const cancelRef = useRef(null);

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Auto-focus cancel button (safe default)
    cancelRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmStyles = variant === 'danger'
    ? 'text-danger border-danger/40 hover:bg-danger hover:text-bg-dark'
    : 'text-accent border-accent/40 hover:bg-accent hover:text-bg-dark';

  return (
    <>
      {/* Backdrop — click to close */}
      <div 
        className="fixed inset-0 bg-black/60 z-[100] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div 
          className="w-full max-w-[400px] bg-surface border border-card-border p-6 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-desc"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title — monospace overline */}
          <h2 
            id="confirm-modal-title"
            className="font-mono text-[11px] tracking-[2px] uppercase text-text-main mb-4"
          >
            {title}
          </h2>

          {/* Description — editorial body */}
          <p 
            id="confirm-modal-desc"
            className="font-body text-[14px] text-text-secondary leading-relaxed mb-8"
          >
            {description}
          </p>

          {/* Actions — pill buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              ref={cancelRef}
              onClick={onClose}
              className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted border border-card-border rounded-full px-6 py-2.5 hover:text-text-main hover:border-text-muted transition-all duration-200 focus:outline-none focus:border-accent"
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`font-mono text-[10px] tracking-[2px] uppercase border rounded-full px-6 py-2.5 transition-all duration-200 focus:outline-none ${confirmStyles}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
