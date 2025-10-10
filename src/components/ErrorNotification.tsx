import React from 'react';
import { AlertCircle, FileEdit, X } from 'lucide-react';

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
  return (
    <div className="bg-white p-2 pb-0 md:p-2 md:pb-0 animate-fadeIn">
      <div className="max-w-[785px] mx-auto">
        <div className="bg-red-50 border border-red-200 border-b-0 rounded-t-2xl p-3 md:p-4">
          <div className="flex items-start gap-2 md:gap-3">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0 mt-0.5" />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] md:text-[14px] font-semibold text-red-900 mb-1">
                    {title}
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-red-700">
                    {message}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                  aria-label="Close error notification"
                >
                  <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-600" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3 pt-3 border-t border-red-200">
                <button
                  onClick={onFeedbackClick}
                  className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 bg-white text-red-700 border border-red-300 rounded-lg text-[11px] md:text-xs font-medium hover:bg-red-50 transition-colors"
                >
                  <FileEdit className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  Report this error
                </button>
                <span className="text-[10px] md:text-[11px] text-red-600">
                  Help us improve by reporting this issue
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
