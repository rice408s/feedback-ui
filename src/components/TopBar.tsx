import React from 'react';
import { Share2, Folder, Menu, FileEdit, CheckCircle2, XCircle } from 'lucide-react';

interface TopBarProps {
  title?: string;
  className?: string;
  onMobileMenuClick?: () => void;
  onFeedbackClick?: () => void;
  onTestSuccess?: () => void;
  onTestFailure?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = 'Eros in cursus turpis massa',
  className = '',
  onMobileMenuClick,
  onFeedbackClick,
  onTestSuccess,
  onTestFailure
}) => {
  return (
    <div className={`bg-white border-b border-zinc-100 px-4 py-2.5 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuClick}
          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors md:hidden"
        >
          <Menu className="w-[18px] h-[18px]" />
        </button>
        <h1 className="text-[15px] font-medium text-zinc-700 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Feedback Button */}
        <button
          onClick={onFeedbackClick}
          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors md:hidden"
        >
          <FileEdit className="w-[16px] h-[16px]" />
        </button>

        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
          <Share2 className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
        </button>

        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
          <Folder className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
        </button>
      </div>
    </div>
  );
};
