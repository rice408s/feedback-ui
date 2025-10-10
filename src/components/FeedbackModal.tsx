import React, { useState } from 'react';
import { FileEdit, X, Upload } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorInfo?: {
    title: string;
    message: string;
  };
}

type FeedbackType = 'bug' | 'feature' | 'other';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, errorInfo }) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(errorInfo ? 'bug' : 'bug');
  const [subject, setSubject] = useState(errorInfo ? errorInfo.title : '');
  const [description, setDescription] = useState(errorInfo ? `Error: ${errorInfo.message}` : '');
  const [email, setEmail] = useState('');
  const [includeSession, setIncludeSession] = useState(true);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(errorInfo ? ['Unexpected Behavior'] : []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setScreenshots(prev => [...prev, ...imageFiles].slice(0, 3)); // 最多3张
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleFeedbackTypeChange = (type: FeedbackType) => {
    setFeedbackType(type);
    setSelectedTags([]); // Clear selected tags when changing type
  };

  // Define tags for each feedback type
  const tagOptions = {
    bug: ['UI Issue', 'Performance', 'Crash', 'Data Loss', 'Unexpected Behavior'],
    feature: ['Productivity', 'Integration', 'Customization', 'Automation', 'Accessibility'],
    other: ['Question', 'Documentation', 'Suggestion', 'Compliment', 'General']
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Feedback submitted:', {
      type: feedbackType,
      subject,
      description,
      email,
      includeSession,
      screenshots: screenshots.map(f => f.name),
      tags: selectedTags
    });

    // 重置表单
    setFeedbackType('bug');
    setSubject('');
    setDescription('');
    setEmail('');
    setIncludeSession(true);
    setScreenshots([]);
    setSelectedTags([]);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-hidden animate-fadeIn flex flex-col border border-zinc-200">
        {/* Header */}
        <div className="bg-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <FileEdit className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-700" />
            <h2 className="text-sm md:text-base font-semibold text-zinc-800">
              {errorInfo ? 'Report Error' : 'Send Feedback'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 hover:bg-zinc-100 rounded"
          >
            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-5 overflow-y-auto flex-1">
          {/* Error Report Notice */}
          {errorInfo && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 md:p-3">
              <p className="text-[11px] md:text-xs text-red-800">
                <span className="font-semibold">🐛 Error Report</span> - You're reporting an error that occurred in the application.
              </p>
            </div>
          )}

          {/* Feedback Type Selection */}
          {!errorInfo && (
            <div>
              <label className="block text-[11px] md:text-xs font-medium text-zinc-700 mb-2">Feedback Type</label>
              <div className="flex gap-1.5 md:gap-2">
                {[
                  { value: 'bug', label: '🐛 Bug Report', icon: '🐛' },
                  { value: 'feature', label: '✨ Feature Request', icon: '✨' },
                  { value: 'other', label: '💬 Other', icon: '💬' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleFeedbackTypeChange(type.value as FeedbackType)}
                    className={`flex-1 px-2 md:px-2.5 py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all ${
                      feedbackType === type.value
                        ? 'bg-indigo-600 text-white border border-indigo-600'
                        : 'bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-[11px] md:text-xs font-medium text-zinc-700 mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your feedback..."
              className="w-full px-2.5 md:px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-[11px] md:text-xs"
            />
          </div>

          {/* Quick Tags */}
          <div>
            <label className="block text-[11px] md:text-xs font-medium text-zinc-700 mb-2">
              Quick Tags <span className="text-zinc-400 text-[10px]">(optional, select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tagOptions[feedbackType].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 text-[10px] md:text-[11px] rounded-lg font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-600 text-white border border-indigo-600'
                      : 'bg-white text-zinc-600 border border-zinc-300 hover:border-indigo-400'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-[11px] md:text-xs font-medium text-zinc-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Please describe your feedback in detail..."
              rows={4}
              className="w-full px-2.5 md:px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-[11px] md:text-xs resize-none"
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label htmlFor="email" className="block text-[11px] md:text-xs font-medium text-zinc-700 mb-2">
              Email <span className="text-zinc-400 text-[10px]">(optional, for follow-up)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-2.5 md:px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-[11px] md:text-xs"
            />
          </div>

          {/* Include Session Info */}
          <div className="flex items-center gap-2 p-2 md:p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
            <input
              type="checkbox"
              id="includeSession"
              checked={includeSession}
              onChange={(e) => setIncludeSession(e.target.checked)}
              className="w-3.5 h-3.5 text-indigo-600 border-zinc-300 rounded focus:ring-2 focus:ring-indigo-400 cursor-pointer flex-shrink-0"
            />
            <label htmlFor="includeSession" className="flex-1 text-[11px] md:text-xs text-zinc-700 cursor-pointer">
              <span className="font-medium">Include current session info</span>
              <p className="text-[10px] text-zinc-500 mt-0.5">Helps us better understand the context of your issue</p>
            </label>
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="block text-[11px] md:text-xs font-medium text-zinc-700 mb-2">
              Upload Screenshots <span className="text-zinc-400 text-[10px]">(optional, max 3)</span>
            </label>

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center w-full h-16 md:h-20 border border-dashed border-zinc-300 rounded-lg cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-5 h-5 md:w-6 md:h-6 mb-1 text-zinc-400" />
                <p className="text-[10px] text-zinc-500">
                  <span className="font-medium text-zinc-700">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5 hidden md:block">PNG, JPG, GIF (max 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            {screenshots.length > 0 && (
              <div className="mt-2 md:mt-3 grid grid-cols-3 gap-2">
                {screenshots.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-16 md:h-20 object-cover rounded-lg border border-zinc-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(index)}
                      className="absolute top-1 right-1 p-0.5 md:p-1 bg-red-500 text-white rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={3} />
                    </button>
                    <div className="absolute bottom-1 left-1 px-1 md:px-1.5 py-0.5 bg-black/60 text-white text-[9px] md:text-[10px] rounded">
                      {file.name.length > 8 ? file.name.substring(0, 8) + '...' : file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-2.5 md:px-3 py-2 bg-zinc-50 text-zinc-600 border border-zinc-200 rounded-lg text-[11px] md:text-xs font-medium hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!description.trim() || isSubmitting}
              className="flex-1 px-2.5 md:px-3 py-2 bg-indigo-600 text-white border border-indigo-600 rounded-lg text-[11px] md:text-xs font-medium hover:bg-indigo-700 hover:border-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
