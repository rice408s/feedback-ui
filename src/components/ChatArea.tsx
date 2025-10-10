import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Play, Copy } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  images?: string[];
  video?: string;
}

interface ChatAreaProps {
  className?: string;
  messages?: Message[];
}

type FeedbackType = 'positive' | 'negative' | null;

// Export Message type for use in other components
export type { Message };

export const ChatArea: React.FC<ChatAreaProps> = ({
  className = '',
  messages: propMessages
}) => {
  const [feedbacks, setFeedbacks] = useState<Record<number, FeedbackType>>({});
  const [showDetailInput, setShowDetailInput] = useState<Record<number, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({});

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

  return (
    <div className={`flex-1 overflow-y-auto bg-white ${className}`}>
      <div className="max-w-[785px] mx-auto py-8 md:py-20 px-3 md:px-4">
        {/* Date Divider */}
        <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-10">
          <div className="flex-1 h-px bg-zinc-100"></div>
          <span className="text-[11px] md:text-[12px] text-zinc-400 whitespace-nowrap">Today 2:45 PM</span>
          <div className="flex-1 h-px bg-zinc-100"></div>
        </div>

        {/* Messages */}
        <div className="space-y-4 md:space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
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

                {/* Text Content */}
                <div className={`rounded-lg p-2.5 md:p-3 ${
                  message.type === 'user'
                    ? 'bg-zinc-100'
                    : 'bg-white'
                }`}>
                  <p className="text-[13px] md:text-[14px] text-zinc-700 leading-relaxed">{message.content}</p>
                </div>

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
          ))}
        </div>
      </div>
    </div>
  );
};
