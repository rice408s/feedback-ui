import React, { useState, useEffect, useRef } from 'react';
import { ThumbsUp, ThumbsDown, Play, Copy, Wand2, Image as ImageIcon, Video as VideoIcon, Music, Volume2 } from 'lucide-react';
import { TaskPlanningCard, type TaskPlanningData } from './TaskPlanningCard';
import { VideoPlanningCard, type VideoPlanningData } from './VideoPlanningCard';
import { InputBox } from './InputBox';
import { ErrorNotification } from './ErrorNotification';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  images?: string[];
  video?: string;
  audio?: string;
  generatedImage?: string;
  generatedVideo?: string;
  taskPlanning?: TaskPlanningData;
  videoPlanning?: VideoPlanningData;
}

interface ErrorInfo {
  title: string;
  message: string;
}

interface ChatAreaProps {
  className?: string;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  errorInfo?: ErrorInfo | null;
  onFeedbackClick?: () => void;
  onCloseError?: () => void;
}

type FeedbackType = 'positive' | 'negative' | null;

// Export Message type for use in other components
export type { Message };

export const ChatArea: React.FC<ChatAreaProps> = ({
  className = '',
  messages: propMessages,
  onSendMessage,
  errorInfo,
  onFeedbackClick,
  onCloseError
}) => {
  const [feedbacks, setFeedbacks] = useState<Record<number, FeedbackType>>({});
  const [showDetailInput, setShowDetailInput] = useState<Record<number, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({});

  // Ref for the tool call container
  const toolCallContainerRef = useRef<HTMLDivElement>(null);
  const latestToolCallRef = useRef<HTMLDivElement>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0);
  const isAutoScrollingToolCall = useRef(false);

  // Ref for the chat messages container
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const latestChatMessageRef = useRef<HTMLDivElement>(null);
  const [userHasScrolledChat, setUserHasScrolledChat] = useState(false);
  const isAutoScrollingChat = useRef(false);

  const handleFeedback = (messageId: number, type: FeedbackType) => {
    const isTogglingSame = feedbacks[messageId] === type;

    setFeedbacks(prev => ({
      ...prev,
      [messageId]: isTogglingSame ? null : type
    }));

    setShowDetailInput(prev => ({
      ...prev,
      [messageId]: !isTogglingSame
    }));
  };

  const closeDetailInput = (messageId: number) => {
    setShowDetailInput(prev => ({
      ...prev,
      [messageId]: false
    }));
  };

  const toggleOption = (messageId: number, option: string) => {
    setSelectedOptions(prev => {
      const current = prev[messageId] || [];
      const isSelected = current.includes(option);
      return {
        ...prev,
        [messageId]: isSelected
          ? current.filter(o => o !== option)
          : [...current, option]
      };
    });
  };

  const handleSubmitFeedback = (messageId: number) => {
    const feedbackData = {
      type: feedbacks[messageId],
      selectedOptions: selectedOptions[messageId] || [],
      messageId
    };

    console.log('Feedback submitted:', feedbackData);

    // Close the detail input after submission
    closeDetailInput(messageId);

    // Optionally show a success message or notification
    // You can add toast notification here if needed
  };

  const positiveOptions = ['Accurate', 'Clear', 'Helpful', 'Fast'];
  const negativeOptions = ['Inaccurate', 'Unclear', 'Not helpful', 'Too slow'];

  const defaultMessages: Message[] = [
    {
      id: 1,
      type: 'user',
      content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam',
      images: [
        'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=120&h=120&fit=crop',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&h=120&fit=crop'
      ]
    },
    {
      id: 2,
      type: 'assistant',
      content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam',
    },
    {
      id: 3,
      type: 'assistant',
      content: "Here's the business card you asked for-i've finished it!",
      video: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=465&h=279&fit=crop'
    }
  ];

  const messages = propMessages || defaultMessages;

  // Find the last assistant message ID
  const lastAssistantMessageId = messages
    .filter(m => m.type === 'assistant')
    .slice(-1)[0]?.id;

  // Separate messages into interactive cards and regular messages
  const interactiveMessages = messages.filter(m =>
    m.taskPlanning || m.videoPlanning || m.generatedImage || m.generatedVideo || m.audio
  );

  // For regular messages, we need to include both:
  // 1. Messages without tool calls
  // 2. Simplified representations of messages WITH tool calls
  const regularMessages = messages.map(m => {
    // If message has tool calls, create a simplified version for the chat
    if (m.taskPlanning || m.videoPlanning || m.generatedImage || m.generatedVideo || m.audio) {
      return {
        ...m,
        // Keep the content but mark it as a tool call
        isToolCallMessage: true
      };
    }
    return m;
  });

  // Calculate bottom spacer height to allow scrolling latest message to top
  useEffect(() => {
    if (interactiveMessages.length > 0 && toolCallContainerRef.current && latestToolCallRef.current) {
      const container = toolCallContainerRef.current;
      const latestElement = latestToolCallRef.current;

      // Calculate how much space we need at the bottom
      const containerHeight = container.clientHeight;
      const latestElementHeight = latestElement.offsetHeight;

      // Get the actual padding from computed styles
      const containerStyle = window.getComputedStyle(container.firstElementChild as Element);
      const topPadding = parseFloat(containerStyle.paddingTop);
      const bottomPadding = parseFloat(containerStyle.paddingBottom);

      // The spacer should be: container height - element height - top padding - bottom padding
      const spacerHeight = Math.max(0, containerHeight - latestElementHeight - topPadding - bottomPadding);

      setBottomSpacerHeight(spacerHeight);
    }
  }, [interactiveMessages.length, interactiveMessages]);

  // Auto-scroll to latest tool call when new one appears
  useEffect(() => {
    console.log('[ToolCallAutoScroll] Effect triggered. Tool calls count:', interactiveMessages.length, 'userHasScrolled:', userHasScrolled, 'latestToolCallRef:', !!latestToolCallRef.current);

    if (interactiveMessages.length > 0 && !userHasScrolled && latestToolCallRef.current && toolCallContainerRef.current) {
      console.log('[ToolCallAutoScroll] Scrolling to latest tool call...');

      // Set flag to ignore scroll events during auto-scroll
      isAutoScrollingToolCall.current = true;

      const container = toolCallContainerRef.current;
      const latestElement = latestToolCallRef.current;

      // Calculate scroll position to show latest message at top
      const elementTop = latestElement.offsetTop;
      const containerPadding = 16;

      // Scroll to position
      const targetScroll = Math.max(0, elementTop - containerPadding);

      console.log('[ToolCallAutoScroll] Scrolling to position:', targetScroll, 'elementTop:', elementTop);

      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });

      // Reset the flag after scroll animation completes
      setTimeout(() => {
        isAutoScrollingToolCall.current = false;
        console.log('[ToolCallAutoScroll] Auto-scroll complete, re-enabling user scroll detection');
      }, 600);
    } else {
      console.log('[ToolCallAutoScroll] Skipped scrolling. Reasons:', {
        hasToolCalls: interactiveMessages.length > 0,
        userHasScrolled,
        hasRef: !!latestToolCallRef.current
      });
    }
  }, [interactiveMessages.length, userHasScrolled]);

  // Track user manual scrolling
  const handleToolCallScroll = () => {
    // Ignore scroll events triggered by auto-scrolling
    if (isAutoScrollingToolCall.current) {
      console.log('[ToolCallScroll] Ignoring scroll event (auto-scrolling in progress)');
      return;
    }

    if (!toolCallContainerRef.current || !latestToolCallRef.current) {
      console.log('[ToolCallScroll] Refs not available');
      return;
    }

    const container = toolCallContainerRef.current;
    const latestElement = latestToolCallRef.current;

    // Check if user is viewing the latest tool call (within threshold)
    const elementTop = latestElement.offsetTop;
    const containerPadding = 16;
    const targetPosition = elementTop - containerPadding;
    const currentPosition = container.scrollTop;
    const threshold = 50; // pixels

    console.log('[ToolCallScroll] currentPosition:', currentPosition, 'targetPosition:', targetPosition, 'diff:', Math.abs(currentPosition - targetPosition));

    // If user scrolled away from the latest tool call position
    if (Math.abs(currentPosition - targetPosition) > threshold) {
      console.log('[ToolCallScroll] User scrolled away from latest, setting userHasScrolled = true');
      setUserHasScrolled(true);
    } else {
      console.log('[ToolCallScroll] User at latest position, setting userHasScrolled = false');
      setUserHasScrolled(false);
    }
  };

  // Track user manual scrolling in chat area
  const handleChatScroll = () => {
    // Ignore scroll events triggered by auto-scrolling
    if (isAutoScrollingChat.current) {
      console.log('[ChatScroll] Ignoring scroll event (auto-scrolling in progress)');
      return;
    }

    if (!chatMessagesContainerRef.current || !latestChatMessageRef.current) {
      console.log('[ChatScroll] Refs not available');
      return;
    }

    const container = chatMessagesContainerRef.current;
    const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

    console.log('[ChatScroll] scrollBottom:', scrollBottom, 'scrollHeight:', container.scrollHeight, 'scrollTop:', container.scrollTop, 'clientHeight:', container.clientHeight);

    // Only mark as user scrolled if they scroll away from the bottom (threshold of 50px)
    if (scrollBottom > 50) {
      console.log('[ChatScroll] User scrolled away from bottom, setting userHasScrolledChat = true');
      setUserHasScrolledChat(true);
    } else {
      console.log('[ChatScroll] User at bottom, setting userHasScrolledChat = false');
      setUserHasScrolledChat(false);
    }
  };

  // Auto-scroll chat messages to latest when new message appears
  useEffect(() => {
    console.log('[AutoScroll] Effect triggered. Messages count:', regularMessages.length, 'userHasScrolledChat:', userHasScrolledChat, 'chatMessagesContainerRef:', !!chatMessagesContainerRef.current);

    if (regularMessages.length > 0 && !userHasScrolledChat && chatMessagesContainerRef.current) {
      console.log('[AutoScroll] Scrolling to latest message...');

      // Set flag to ignore scroll events during auto-scroll
      isAutoScrollingChat.current = true;

      const container = chatMessagesContainerRef.current;

      // Scroll container to bottom directly
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });

      console.log('[AutoScroll] Scrolling to scrollHeight:', container.scrollHeight);

      // Reset the flag after scroll animation completes (smooth scroll takes ~300-500ms)
      setTimeout(() => {
        isAutoScrollingChat.current = false;
        console.log('[AutoScroll] Auto-scroll complete, re-enabling user scroll detection');
      }, 600);
    } else {
      console.log('[AutoScroll] Skipped scrolling. Reasons:', {
        hasMessages: regularMessages.length > 0,
        userHasScrolledChat,
        hasRef: !!chatMessagesContainerRef.current
      });
    }
  }, [regularMessages.length, userHasScrolledChat]);

  return (
    <div className={`flex w-full h-full bg-white ${className}`}>
      {/* Left Panel - Interactive Cards (Main Area) */}
      <div
        ref={toolCallContainerRef}
        className="flex-1 border-r border-zinc-100 overflow-y-auto bg-zinc-50 scroll-smooth"
        onScroll={handleToolCallScroll}
      >
          <div className="px-4 md:px-6 pt-6 md:pt-8 pb-4 md:pb-6 space-y-4 md:space-y-6 min-h-full">
            {interactiveMessages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-zinc-400">暂无工具调用</p>
              </div>
            ) : (
              <>
                {interactiveMessages.map((message, index) => {
                  const isLatest = index === interactiveMessages.length - 1;
                  return (
                    <div
                      key={message.id}
                      ref={isLatest ? latestToolCallRef : null}
                      className={`transition-all duration-300 ${isLatest ? 'animate-slideInUp' : ''}`}
                    >
                      {/* Task Planning */}
                      {message.taskPlanning && (
                        <TaskPlanningCard data={message.taskPlanning} />
                      )}

                      {/* Video Planning */}
                      {message.videoPlanning && (
                        <VideoPlanningCard data={message.videoPlanning} />
                      )}

                      {/* Generated Image */}
                      {message.generatedImage && (
                        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                          <div className="relative">
                            <div className="absolute top-3 left-3 z-10">
                              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
                                <ImageIcon className="w-3.5 h-3.5 text-white" />
                                <span className="text-xs text-white font-medium">AI Generated Image</span>
                              </div>
                            </div>
                            <img src={message.generatedImage} alt="Generated" className="w-full h-auto object-cover" />
                          </div>
                        </div>
                      )}

                      {/* Generated Video */}
                      {message.generatedVideo && (
                        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                          <div className="relative group cursor-pointer">
                            <div className="absolute top-3 left-3 z-10">
                              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
                                <VideoIcon className="w-3.5 h-3.5 text-white" />
                                <span className="text-xs text-white font-medium">AI Generated Video</span>
                              </div>
                            </div>
                            <img src={message.generatedVideo} alt="Generated Video" className="w-full h-auto object-cover" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-zinc-800 ml-1 fill-zinc-800" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Audio Message */}
                      {message.audio && (
                        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm p-5">
                          <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
                            <div className="flex items-center gap-4">
                              <button className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md">
                                <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                              </button>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Music className="w-4 h-4 text-indigo-600" />
                                  <span className="text-xs font-medium text-indigo-900">Audio Message</span>
                                  <span className="ml-auto text-xs text-indigo-700 font-mono">0:00 / 2:34</span>
                                </div>
                                <div className="h-1.5 bg-indigo-200 rounded-full overflow-hidden">
                                  <div className="h-full w-0 bg-indigo-600 rounded-full"></div>
                                </div>
                              </div>
                              <button className="p-2 hover:bg-indigo-100 rounded-lg transition-colors">
                                <Volume2 className="w-4 h-4 text-indigo-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Bottom spacer to allow latest message to scroll to top */}
                <div style={{ height: `${bottomSpacerHeight}px` }}></div>
              </>
            )}
          </div>
      </div>

      {/* Right Panel - Regular Messages (Sidebar) */}
      <div className="w-[380px] bg-white border-l border-zinc-100 flex flex-col">
          <div className="p-4 border-b border-zinc-200 bg-white">
            <h3 className="text-base font-semibold text-zinc-800">对话</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Today 2:45 PM</p>
          </div>

          {/* Messages Area - Scrollable */}
          <div
            ref={chatMessagesContainerRef}
            className="flex-1 overflow-y-auto px-3 py-4 scroll-smooth"
            onScroll={handleChatScroll}
          >
            {/* Messages */}
            <div className="space-y-4">
              {regularMessages.map((message, index) => {
                const isLatestMessage = index === regularMessages.length - 1;
                return (
            <div
              key={message.id}
              ref={isLatestMessage ? latestChatMessageRef : null}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-col gap-2 md:gap-3 max-w-[90%] md:max-w-full">
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] md:text-xs">I</span>
                    </div>
                    <span className="text-[14px] md:text-[15px] font-semibold text-zinc-800">Ima</span>
                  </div>
                )}

                {/* Images */}
                {message.images && (
                  <div className="flex gap-2">
                    {message.images.map((img, idx) => (
                      <div key={idx} className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-lg overflow-hidden border border-zinc-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Text Content or Tool Call Indicator */}
                {(message as any).isToolCallMessage ? (
                  // Show simplified tool call indicator
                  <div className="rounded-lg p-2.5 md:p-3 bg-indigo-50 border border-indigo-200">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-indigo-600" />
                      <div className="flex-1">
                        <div className="text-[12px] font-medium text-indigo-900">
                          {message.taskPlanning
                            ? '任务规划'
                            : message.videoPlanning
                            ? '视频规划'
                            : message.generatedImage
                            ? 'AI 生成图像'
                            : message.generatedVideo
                            ? 'AI 生成视频'
                            : message.audio
                            ? '音频消息'
                            : '工具调用'}
                        </div>
                        <div className="text-[11px] text-indigo-600 mt-0.5">
                          查看详情 →
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show normal message content
                  <div className={`rounded-lg p-2.5 md:p-3 ${
                    message.type === 'user'
                      ? 'bg-zinc-100'
                      : 'bg-white'
                  }`}>
                    <p className="text-[13px] md:text-[14px] text-zinc-700 leading-relaxed">{message.content}</p>
                  </div>
                )}

                {/* Video */}
                {message.video && (
                  <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <img src={message.video} alt="" className="w-full h-[200px] md:h-[279px] object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-zinc-800 ml-0.5 md:ml-1 fill-zinc-800" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Generated Image */}
                {message.generatedImage && (
                  <div className="relative rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                    <div className="absolute top-2 left-2 z-10">
                      <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md">
                        <ImageIcon className="w-3 h-3 text-white" />
                        <span className="text-[10px] text-white font-medium">AI Generated</span>
                      </div>
                    </div>
                    <img src={message.generatedImage} alt="Generated" className="w-full h-auto object-cover" />
                  </div>
                )}

                {/* Generated Video */}
                {message.generatedVideo && (
                  <div className="relative rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 group cursor-pointer">
                    <div className="absolute top-2 left-2 z-10">
                      <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md">
                        <VideoIcon className="w-3 h-3 text-white" />
                        <span className="text-[10px] text-white font-medium">AI Generated Video</span>
                      </div>
                    </div>
                    <img src={message.generatedVideo} alt="Generated Video" className="w-full h-[200px] md:h-[279px] object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-zinc-800 ml-0.5 md:ml-1 fill-zinc-800" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Audio */}
                {message.audio && (
                  <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-3">
                    <div className="flex items-center gap-3">
                      <button className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors flex-shrink-0">
                        <Play className="w-4 h-4 text-white ml-0.5 fill-white" />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Music className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-[11px] font-medium text-indigo-900">Audio Message</span>
                        </div>
                        <div className="h-1 bg-indigo-200 rounded-full overflow-hidden">
                          <div className="h-full w-0 bg-indigo-600 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-indigo-600">0:00</span>
                          <Volume2 className="w-3 h-3 text-indigo-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions for assistant messages */}
                {message.type === 'assistant' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        <button className="p-1.5 hover:bg-zinc-100 rounded transition-colors">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      {message.video && (
                        <button className="px-2 py-1 bg-zinc-700 text-white text-[11px] rounded hover:bg-zinc-800 transition-colors">
                          Publish
                        </button>
                      )}
                    </div>

                    {/* Satisfaction Feedback - Only show for last assistant message */}
                    {message.id === lastAssistantMessageId && (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-zinc-100">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleFeedback(message.id, 'positive')}
                              className={`group flex items-center gap-1 px-2 md:px-2.5 py-1.5 rounded-lg text-[11px] md:text-xs font-medium transition-all ${
                                feedbacks[message.id] === 'positive'
                                  ? 'bg-green-100 text-green-700 border border-green-300'
                                  : 'bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-green-50 hover:border-green-200'
                              }`}
                            >
                              <ThumbsUp
                                className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform ${
                                  feedbacks[message.id] === 'positive' ? 'scale-110 fill-current' : 'group-hover:scale-110'
                                }`}
                              />
                              {feedbacks[message.id] === 'positive' ? 'Satisfied' : 'Good'}
                            </button>

                            <button
                              onClick={() => handleFeedback(message.id, 'negative')}
                              className={`group flex items-center gap-1 px-2 md:px-2.5 py-1.5 rounded-lg text-[11px] md:text-xs font-medium transition-all ${
                                feedbacks[message.id] === 'negative'
                                  ? 'bg-red-100 text-red-700 border border-red-300'
                                  : 'bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-red-50 hover:border-red-200'
                              }`}
                            >
                              <ThumbsDown
                                className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform ${
                                  feedbacks[message.id] === 'negative' ? 'scale-110 fill-current' : 'group-hover:scale-110'
                                }`}
                              />
                              {feedbacks[message.id] === 'negative' ? 'Not satisfied' : 'Bad'}
                            </button>
                          </div>
                        </div>

                        {/* Additional Feedback Prompt */}
                        {feedbacks[message.id] && showDetailInput[message.id] && (
                          <div className="animate-fadeIn bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-lg p-2.5 md:p-3">
                            <p className="text-[11px] md:text-xs text-zinc-700 mb-2">
                              {feedbacks[message.id] === 'positive'
                                ? 'Thank you for your feedback! What did you like?'
                                : 'Sorry we couldn\'t help. What went wrong?'}
                            </p>

                            {/* Quick Options */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {(feedbacks[message.id] === 'positive' ? positiveOptions : negativeOptions).map((option) => (
                                <button
                                  key={option}
                                  onClick={() => toggleOption(message.id, option)}
                                  className={`px-2 py-1 text-[10px] md:text-[11px] rounded-lg font-medium transition-all ${
                                    (selectedOptions[message.id] || []).includes(option)
                                      ? 'bg-indigo-600 text-white border border-indigo-600'
                                      : 'bg-white text-zinc-600 border border-zinc-300 hover:border-indigo-400'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>

                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                placeholder="(Optional) Additional comments..."
                                className="w-full px-2.5 md:px-3 py-1.5 text-[11px] md:text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => closeDetailInput(message.id)}
                                  className="flex-1 sm:flex-none px-2.5 py-1.5 bg-zinc-50 text-zinc-600 border border-zinc-200 text-[11px] md:text-xs rounded-lg hover:bg-zinc-100 transition-colors font-medium"
                                >
                                  Skip
                                </button>
                                <button
                                  onClick={() => handleSubmitFeedback(message.id)}
                                  className="flex-1 sm:flex-none px-2.5 py-1.5 bg-indigo-600 text-white border border-indigo-600 text-[11px] md:text-xs rounded-lg hover:bg-indigo-700 hover:border-indigo-700 transition-all font-medium"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
                );
              })}
            </div>
          </div>

          {/* Error Notification */}
          {errorInfo && onFeedbackClick && onCloseError && (
            <ErrorNotification
              title={errorInfo.title}
              message={errorInfo.message}
              onFeedbackClick={onFeedbackClick}
              onClose={onCloseError}
            />
          )}

          {/* Input Box */}
          {onSendMessage && (
            <InputBox onSend={onSendMessage} hasError={!!errorInfo} />
          )}
      </div>
    </div>
  );
};
