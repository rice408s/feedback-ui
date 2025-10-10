import { useState } from 'react';
import { FileEdit, CheckCircle2, XCircle } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ChatArea, type Message } from './components/ChatArea';
import { InputBox } from './components/InputBox';
import { FeedbackModal } from './components/FeedbackModal';
import { ErrorNotification } from './components/ErrorNotification';

interface ErrorInfo {
  title: string;
  message: string;
}

function App() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'user',
      content: 'Create a business card for me',
      images: []
    },
    {
      id: 2,
      type: 'assistant',
      content: 'Sure! I will create a business card for you.',
    }
  ]);

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: message
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleTestSuccess = () => {
    // Clear any error
    setErrorInfo(null);

    // Add success message
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'assistant',
      content: "Here's the business card you asked for - I've finished it!",
      video: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=465&h=279&fit=crop'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleTestFailure = () => {
    // Show error notification
    setErrorInfo({
      title: 'IMA Task Data Error',
      message: 'Please check the network connection and try again.'
    });
  };

  return (
    <div className="flex h-screen bg-zinc-100 overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white md:rounded-l-2xl overflow-hidden md:shadow-lg">
        {/* Top Bar */}
        <TopBar
          onMobileMenuClick={() => setIsMobileSidebarOpen(true)}
          onFeedbackClick={() => setIsFeedbackOpen(true)}
        />

        {/* Chat Area */}
        <ChatArea
          className="flex-1"
          messages={messages}
        />

        {/* Error Notification */}
        {errorInfo && (
          <ErrorNotification
            title={errorInfo.title}
            message={errorInfo.message}
            onFeedbackClick={() => setIsFeedbackOpen(true)}
            onClose={() => setErrorInfo(null)}
          />
        )}

        {/* Input Box */}
        <InputBox onSend={handleSendMessage} hasError={!!errorInfo} />
      </div>

      {/* Floating Test Buttons */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg shadow-md z-50">
        <span className="text-[10px] text-zinc-500 font-medium">TEST:</span>
        <button
          onClick={handleTestSuccess}
          className="p-1.5 hover:bg-green-50 rounded transition-colors group"
          title="Test Success"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={handleTestFailure}
          className="p-1.5 hover:bg-red-50 rounded transition-colors group"
          title="Test Failure"
        >
          <XCircle className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Floating Feedback Button - Desktop only */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="group hidden md:flex fixed bottom-6 right-6 items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white border border-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-700 hover:border-indigo-700 transition-all shadow-md hover:shadow-lg z-50"
      >
        <FileEdit className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
        Feedback
      </button>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        errorInfo={errorInfo || undefined}
      />
    </div>
  );
}

export default App;
