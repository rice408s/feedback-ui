import React, { useState } from 'react';
import { AlertCircle, FileEdit, X, CheckCircle } from 'lucide-react';

interface ErrorNotificationProps {
  title: string;
  message: string;
  onFeedbackClick: () => void;
  onClose: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  title,
  message,
  onFeedbackClick,
  onClose
}) => {
  const [isReported, setIsReported] = useState(false);

  const handleQuickReport = () => {
    // Quick report - submit error info directly
    const errorReport = {
      type: 'bug',
      title,
      message,
      timestamp: new Date().toISOString(),
      tags: ['Unexpected Behavior']
    };

    console.log('Quick error report submitted:', errorReport);
    setIsReported(true);

    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="bg-white p-2 pb-0 md:p-2 md:pb-0 animate-fadeIn">
      <div className="max-w-[785px] mx-auto">
        <div className={`border border-b-0 rounded-t-2xl p-3 md:p-4 transition-colors ${
          isReported ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-2 md:gap-3">
            {isReported ? (
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[13px] md:text-[14px] font-semibold mb-1 ${
                    isReported ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {isReported ? '✓ Error Reported' : title}
                  </h3>
                  <p className={`text-[12px] md:text-[13px] ${
                    isReported ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isReported ? 'Thank you! We\'ve received your error report.' : message}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className={`p-1 rounded transition-colors flex-shrink-0 ${
                    isReported ? 'hover:bg-green-100' : 'hover:bg-red-100'
                  }`}
                  aria-label="Close error notification"
                >
                  <X className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
                    isReported ? 'text-green-600' : 'text-red-600'
                  }`} />
                </button>
              </div>

              {!isReported && (
                <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-red-200">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleQuickReport}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 md:px-3 py-1.5 bg-red-600 text-white border border-red-600 rounded-lg text-[11px] md:text-xs font-medium hover:bg-red-700 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      Quick Report
                    </button>
                    <button
                      onClick={onFeedbackClick}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 md:px-3 py-1.5 bg-white text-red-700 border border-red-300 rounded-lg text-[11px] md:text-xs font-medium hover:bg-red-50 transition-colors"
                    >
                      <FileEdit className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      Add Details
                    </button>
                  </div>
                  <span className="text-[10px] md:text-[11px] text-red-600 text-center">
                    Click "Quick Report" to submit instantly, or "Add Details" for more info
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
