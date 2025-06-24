import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <AlertCircle size={20} />
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="error-close">
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;