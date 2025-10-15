import React from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';

const Message = ({ message, currentUser, selectedUser, onDelete, showAvatar, getRandomColor }) => {
    const isCurrentUser = message.senderId === currentUser.uid;

    return (
        <div className={`group flex items-end space-x-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {isCurrentUser && !message.deleted && (
                <button 
                    onClick={() => onDelete(message.id)}
                    className="shrink-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete message"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            )}

            {!isCurrentUser && (
                <div className={`w-8 h-8 rounded-full flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                    <div className={`w-full h-full bg-gradient-to-r ${getRandomColor(selectedUser.email)} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-xs font-medium">
                            {selectedUser.email.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
            )}

            <div className={`max-w-xl lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${ isCurrentUser ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-md' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md' }`}>
                <p className={`text-sm leading-relaxed ${message.deleted ? 'italic text-gray-400' : ''}`}>
                    {message.text}
                </p>
                {!message.deleted && (
                    <div className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-100' : 'text-gray-400'}`}>
                        {message.timestamp?.toDate ? new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                    </div>
                )}
            </div>
            
            {isCurrentUser && (
                <div className={`w-8 h-8 rounded-full flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                    <div className="w-full h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                            {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Message;