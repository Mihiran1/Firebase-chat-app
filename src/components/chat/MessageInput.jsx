import React, { useState, useRef } from 'react';

const MessageInput = ({ onSendMessage, onSendFile }) => {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    // Common emojis for quick access
    const commonEmojis = [
        '😀', '😂', '🥰', '😍', '🤔', '😎', '😭', '😱', '😴', '🤗',
        '👍', '👎', '👋', '🙏', '💪', '👏', '🔥', '💯', '❤️', '💕',
        '🎉', '🎊', '✨', '⭐', '💝', '🎁', '🎂', '🍕', '☕', '🌟'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() || attachedFiles.length > 0) {
            if (attachedFiles.length > 0) {
                attachedFiles.forEach(file => {
                    onSendFile && onSendFile(file);
                });
            }
            if (message.trim()) {
                onSendMessage(message);
            }
            setMessage('');
            setAttachedFiles([]);
            adjustTextareaHeight();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleEmojiClick = (emoji) => {
        setMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
        textareaRef.current?.focus();
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Maximum size is 10MB.`);
                return false;
            }
            return true;
        });
        
        setAttachedFiles(prev => [...prev, ...validFiles]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    };

    const handleTextChange = (e) => {
        setMessage(e.target.value);
        adjustTextareaHeight();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return '🖼️';
        if (file.type.startsWith('video/')) return '🎥';
        if (file.type.startsWith('audio/')) return '🎵';
        if (file.type.includes('pdf')) return '📄';
        if (file.type.includes('document') || file.type.includes('word')) return '📝';
        if (file.type.includes('spreadsheet') || file.type.includes('excel')) return '📊';
        return '📎';
    };

    return (
        <div className="bg-white border-t border-gray-200/60 -mb-20 shadow-lg backdrop-blur-sm z-10">
            {/* File Attachments Preview */}
            {attachedFiles.length > 0 && (
                <div className="px-4 sm:px-6 py-3 border-b border-gray-100/60 bg-gradient-to-r from-gray-50/80 to-indigo-50/30 backdrop-blur-sm">
                    <div className="flex flex-wrap gap-3">
                        {attachedFiles.map((file, index) => (
                            <div 
                                key={index} 
                                className="flex items-center space-x-3 bg-white rounded-xl px-3 py-2 border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                <span className="text-xl">{getFileIcon(file)}</span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-800 truncate max-w-[140px] sm:max-w-[220px] group-hover:text-indigo-700 transition-colors duration-200">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 p-1.5 rounded-full transition-all duration-200 transform hover:scale-110"
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100/60 bg-white/90 backdrop-blur-sm shadow-inner">
                    <div className="grid grid-cols-10 gap-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                        <style jsx>{`
                            .scrollbar-hide {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {commonEmojis.map((emoji, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleEmojiClick(emoji)}
                                className="text-2xl p-2 rounded-xl hover:bg-indigo-50/80 hover:text-indigo-600 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                aria-label={`Insert ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50/50 to-indigo-50/20">
                <div className="flex items-end space-x-3">
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        {/* File Attachment Button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2.5 text-gray-600 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            title="Attach file"
                            aria-label="Attach file"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>

                        {/* Emoji Button */}
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`p-2.5 rounded-full shadow-sm transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                                showEmojiPicker 
                                    ? 'text-indigo-600 bg-indigo-100/80' 
                                    : 'text-gray-600 bg-white/80 backdrop-blur-sm hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                            title="Add emoji"
                            aria-label="Toggle emoji picker"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Text Input */}
                    <div className="flex-1 relative group">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={handleTextChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="w-full px-4 py-3 pr-12 border border-gray-200/80 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm text-sm transition-all duration-300 placeholder-gray-400 hover:border-gray-300 hover:shadow-md max-h-[120px] min-h-[48px]"
                            rows="1"
                            aria-label="Message input"
                        />
                        
                        {/* Send Button - Positioned inside textarea */}
                        <button
                            type="submit"
                            disabled={!message.trim() && attachedFiles.length === 0}
                            className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-sm transition-all duration-200 ${
                                message.trim() || attachedFiles.length > 0
                                    ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md hover:shadow-lg transform hover:scale-105'
                                    : 'text-gray-400 bg-gray-100/80 cursor-not-allowed'
                            }`}
                            aria-label="Send message"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                />
            </form>
        </div>
    );
};

export default MessageInput;