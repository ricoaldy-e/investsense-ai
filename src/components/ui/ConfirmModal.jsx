import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmLabel = 'CONFIRM',
  cancelLabel,
  variant = 'danger'
}) => {
  const { t } = useTranslation();
  const resolvedCancelLabel = cancelLabel || t('modal.cancel');
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    cancelRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmStyles = variant === 'danger'
    ? 'text-danger border-danger/40 hover:bg-danger hover:text-bg-dark'
    : 'text-accent border-accent/40 hover:bg-accent hover:text-bg-dark';

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[100] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div 
          className="w-full max-w-[400px] bg-surface border border-card-border p-6 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-desc"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 
            id="confirm-modal-title"
            className="font-mono text-[11px] tracking-[2px] uppercase text-text-main mb-4"
          >
            {title}
          </h2>

          <p 
            id="confirm-modal-desc"
            className="font-body text-[14px] text-text-secondary leading-relaxed mb-8"
          >
            {description}
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              ref={cancelRef}
              onClick={onClose}
              className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted border border-card-border rounded-full px-6 py-2.5 hover:text-text-main hover:border-text-muted transition-all duration-200 focus:outline-none focus:border-accent"
            >
              {resolvedCancelLabel}
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
