import React from 'react';

interface StatusModalProps {
  isOpen: boolean;
  status: 'loading' | 'success' | 'error';
  message: string;
  details?: string; // Add details for debugging
  onClose: () => void;
}

export default function StatusModal({ isOpen, status, message, details, onClose }: StatusModalProps) {
  if (!isOpen) return null;
  
  const getIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        );
      case 'success':
        return (
          <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            {getIcon()}
          </div>
          <h3 className="text-lg font-medium mb-2 text-center">
            {status === 'loading' ? 'Generating Article' : status === 'success' ? 'Success!' : 'Error'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">{message}</p>
          
          {details && status === 'error' && (
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-40 w-full">
              <pre>{details}</pre>
            </div>
          )}
          
          {status !== 'loading' && (
            <div className="flex flex-col space-y-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md"
              >
                Close
              </button>
              
              {status === 'error' && (
                <button 
                  onClick={() => {
                    // Copy debug info to clipboard
                    if (details) {
                      navigator.clipboard.writeText(details);
                      alert('Debug info copied to clipboard');
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm"
                >
                  Copy Debug Info
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
