import { useState, useEffect, useCallback } from 'react';
import { FileEdit, CheckCircle2, XCircle, ListTodo, Video, Image, Music } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ChatArea, type Message } from './components/ChatArea';
import { FeedbackModal } from './components/FeedbackModal';

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
      content: '帮我制作一张名片',
      images: []
    },
    {
      id: 2,
      type: 'assistant',
      content: '好的！我会为你制作一张名片。',
    }
  ]);

  // Draggable test buttons state with localStorage persistence
  const getInitialPosition = () => {
    try {
      const saved = localStorage.getItem('testButtonPosition');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load button position:', e);
    }
    return { x: window.innerWidth - 150, y: window.innerHeight / 2 - 30 };
  };

  const [testButtonPos, setTestButtonPos] = useState(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
      content: "这是你要的名片 - 我已经完成了！",
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

  const handleTestTaskPlanning = () => {
    // Clear any error
    setErrorInfo(null);

    // Add task planning message with structured data
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'assistant',
      content: "我会为你制作一张名片，这是我的计划：",
      taskPlanning: {
        title: '任务规划',
        steps: [
          {
            title: '收集信息',
            description: '',
            substeps: [
              '姓名、职位和联系方式',
              '品牌颜色和风格偏好',
              '需要突出的关键信息'
            ]
          },
          {
            title: '设计布局',
            description: '',
            substeps: [
              '选择专业模板',
              '优化可读性排版',
              '确保合理间距'
            ]
          },
          {
            title: '创建视觉元素',
            description: '',
            substeps: [
              'Logo 位置',
              '字体选择和大小',
              '色彩方案应用'
            ]
          },
          {
            title: '审查优化',
            description: '',
            substeps: [
              '验证联系信息',
              '检查专业标准',
              '应用最终调整'
            ]
          }
        ]
      }
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleTestVideoPlanning = () => {
    // Clear any error
    setErrorInfo(null);

    // Add video planning message with structured data
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'assistant',
      content: "我已经为你规划好了名片展示视频：",
      videoPlanning: {
        title: '名片展示视频规划',
        totalScenes: 4,
        scenes: [
          {
            sceneNumber: 1,
            title: '开场',
            description: '干净的白色背景，名片从画面外优雅地滑入，缓缓旋转展示正面',
            duration: '3秒',
            voiceover: '在这个数字化的时代，一张精美的名片依然是专业形象的最佳代言。'
          },
          {
            sceneNumber: 2,
            title: '姓名与职位',
            description: '镜头聚焦到名片上的姓名和职位，字体清晰可见，略微推近强调重点信息',
            duration: '2.5秒'
          },
          {
            sceneNumber: 3,
            title: '联系方式',
            description: '镜头横移，展示电话号码、邮箱地址和网站信息，每项信息都清晰呈现',
            duration: '2.5秒',
            voiceover: '让每一次连接都变得简单而优雅。'
          },
          {
            sceneNumber: 4,
            title: '收尾',
            description: '名片整体展示，Logo 突出显示，轻微的光晕效果增添质感',
            duration: '3秒',
            voiceover: '你的品牌，值得被完美呈现。'
          }
        ]
      }
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleTestGeneratedImage = () => {
    // Clear any error
    setErrorInfo(null);

    // Add generated image message
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'assistant',
      content: "我已经为你生成了名片设计：",
      generatedImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&fit=crop'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleTestGeneratedVideo = () => {
    // Clear any error
    setErrorInfo(null);

    // Add generated video message
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'assistant',
      content: "名片展示视频已经生成完成：",
      generatedVideo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleTestAudio = () => {
    // Clear any error
    setErrorInfo(null);

    // Add audio message
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'assistant',
      content: "这是名片设计的语音解说：",
      audio: 'https://example.com/audio.mp3'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Draggable handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - testButtonPos.x,
      y: e.clientY - testButtonPos.y
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setTestButtonPos({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  }, [dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Save position to localStorage when drag ends
    try {
      localStorage.setItem('testButtonPosition', JSON.stringify(testButtonPos));
    } catch (e) {
      console.error('Failed to save button position:', e);
    }
  }, [testButtonPos]);

  // Add/remove mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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

        {/* Chat Area - Now independent from TopBar */}
        <div className="flex-1 flex overflow-hidden">
          <ChatArea
            className="flex-1"
            messages={messages}
            onSendMessage={handleSendMessage}
            errorInfo={errorInfo}
            onFeedbackClick={() => setIsFeedbackOpen(true)}
            onCloseError={() => setErrorInfo(null)}
          />
        </div>
      </div>

      {/* Floating Test Buttons - Draggable */}
      <div
        className={`fixed flex items-center gap-1.5 px-2.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg shadow-md z-50 ${
          isDragging ? 'cursor-grabbing shadow-xl' : 'cursor-grab'
        }`}
        style={{
          left: `${testButtonPos.x}px`,
          top: `${testButtonPos.y}px`,
        }}
        onMouseDown={handleMouseDown}
      >
        <span className="text-[10px] text-zinc-500 font-medium select-none pointer-events-none">
          TEST:
        </span>
        <button
          onClick={handleTestTaskPlanning}
          className="p-1.5 hover:bg-indigo-50 rounded transition-colors group"
          title="测试任务规划"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ListTodo className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={handleTestVideoPlanning}
          className="p-1.5 hover:bg-blue-50 rounded transition-colors group"
          title="测试视频规划"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Video className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={handleTestGeneratedImage}
          className="p-1.5 hover:bg-purple-50 rounded transition-colors group"
          title="测试生成图像"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Image className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={handleTestGeneratedVideo}
          className="p-1.5 hover:bg-pink-50 rounded transition-colors group"
          title="测试生成视频"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Video className="w-3.5 h-3.5 text-pink-600 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={handleTestAudio}
          className="p-1.5 hover:bg-violet-50 rounded transition-colors group"
          title="测试音频"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Music className="w-3.5 h-3.5 text-violet-600 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={handleTestSuccess}
          className="p-1.5 hover:bg-green-50 rounded transition-colors group"
          title="测试成功"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={handleTestFailure}
          className="p-1.5 hover:bg-red-50 rounded transition-colors group"
          title="测试失败"
          onMouseDown={(e) => e.stopPropagation()}
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
