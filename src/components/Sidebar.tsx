import React, { useState, useEffect } from 'react';
import { Home, Sparkles, Trophy, Plus, PanelLeft, MessageCircle, Twitter, Megaphone, Globe, Settings, Zap, X } from 'lucide-react';

interface SidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className = '',
  isMobileOpen = false,
  onMobileClose
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen && onMobileClose) {
        onMobileClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen, onMobileClose]);
  const chatHistory = [
    'Eros in cursus turpis massa',
    'Quis ipsum suspendisse',
    'Ut tristique et egestas quis ipsum sus',
    'Sed viverra tellus inhac',
    'Eros in cursus turpis massa',
    'Dictum at tempor commodo ullamcorper',
    'Morbi tristique senectus et',
    'Nunc scelerisque viverra mauris',
    'Phasellus volutpat blandit aliquam',
    'Cras tincidunt lobortis feugiat vivamus',
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-zinc-100 h-screen overflow-y-auto flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-[60px]' : 'w-[296px]'
      } ${
        // Mobile: Fixed position, slide in from left
        'fixed md:relative z-50 md:z-auto'
      } ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${className}`}>
        {/* Header */}
        <div className={`h-[85px] px-6 pt-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <div className="text-xl font-semibold text-zinc-800">Ima Studio</div>
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-zinc-200 rounded-lg transition-colors hidden md:block"
          >
            <PanelLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="p-2 hover:bg-zinc-200 rounded-lg transition-colors md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      {/* Navigation Tabs */}
      {!isCollapsed && (
        <div className="px-4 flex flex-col gap-3 mb-6">
          <button className="flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors text-left text-zinc-700 text-[15px]">
            <Home className="w-[15px] h-[15px]" />
            Home
          </button>

          <button className="flex items-center gap-2 px-2 py-2.5 rounded-lg bg-zinc-200 text-left text-zinc-700 text-[15px]">
            <Sparkles className="w-[15px] h-[15px]" />
            Create with Ima Agent
          </button>

          <button className="flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors text-left text-zinc-700 text-[15px]">
            <Trophy className="w-[15px] h-[15px]" />
            Ima Arena
          </button>
        </div>
      )}

      {/* Chat History */}
      {!isCollapsed && (
        <div className="flex-1 px-6 pb-6 border-t border-zinc-200 pt-6">
          <div className="px-2.5 mb-3">
            <p className="text-[12px] text-zinc-400 font-medium">CHAT HISTORY</p>
          </div>

          <button className="w-full flex items-center gap-2 px-2 py-2.5 mb-3 rounded-lg bg-zinc-50 border border-zinc-200 hover:bg-white transition-colors text-left">
            <Plus className="w-[15px] h-[15px]" />
            <span className="text-[15px] text-zinc-800">Start new chat</span>
          </button>

          <div className="flex flex-col gap-0.5">
            {chatHistory.map((chat, index) => (
              <button
                key={index}
                className={`px-3 py-2.5 rounded-lg text-left text-[15px] text-zinc-700 hover:bg-zinc-200 transition-colors truncate ${
                  index === 0 ? 'bg-zinc-200' : ''
                }`}
              >
                {chat}
                {index === 0 && <span className="float-right">···</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`border-t border-zinc-200 ${isCollapsed ? 'p-3' : 'p-6'}`}>
        {!isCollapsed ? (
          <>
            <div className="flex gap-2 mb-4">
              <button className="flex-1 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-white transition-colors flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 text-zinc-600" />
              </button>
              <button className="flex-1 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-white transition-colors flex items-center justify-center">
                <Twitter className="w-3.5 h-3.5 text-zinc-600" />
              </button>
              <button className="flex-1 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-white transition-colors flex items-center justify-center">
                <Megaphone className="w-3.5 h-3.5 text-zinc-600" />
              </button>
              <button className="flex-1 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-white transition-colors flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-zinc-600" />
              </button>
              <button className="flex-1 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-white transition-colors flex items-center justify-center">
                <Settings className="w-3.5 h-3.5 text-zinc-600" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
              <div className="flex items-center gap-1 px-2 py-1 bg-white border border-zinc-200 rounded-lg">
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="text-[11px] text-zinc-700">3,521</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};
