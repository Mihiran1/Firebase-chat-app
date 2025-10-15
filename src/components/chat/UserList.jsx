import React, { useState } from 'react';

const UserList = ({ users, onSelectUser, selectedUser, onlineStatus, lastMessages, onDeleteChat }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const filteredUsers = users.filter(user =>
        (user.username?.toLowerCase() || user.email.toLowerCase()).includes(searchQuery.toLowerCase())
    );

    const getInitials = (user) => {
        if (user.username) return user.username.charAt(0).toUpperCase();
        return user.email.charAt(0).toUpperCase();
    };

    const getRandomColor = (email) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-emerald-500 to-emerald-600',
            'from-purple-500 to-purple-600',
            'from-pink-500 to-pink-600',
            'from-amber-500 to-amber-600',
            'from-indigo-500 to-indigo-600',
            'from-rose-500 to-rose-600',
            'from-teal-500 to-teal-600',
            'from-cyan-500 to-cyan-600',
            'from-violet-500 to-violet-600'
        ];
        const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const formatLastMessage = (message) => {
        if (!message) return 'Start a conversation';
        if (message.length > 35) return message.substring(0, 35) + '...';
        return message;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        
        const now = new Date();
        const msgDate = new Date(timestamp);
        const diffInMinutes = Math.floor((now - msgDate) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'now';
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
        
        const diffInDays = Math.floor(diffInMinutes / 1440);
        if (diffInDays === 1) return '1d';
        if (diffInDays < 7) return `${diffInDays}d`;
        
        return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleDeleteClick = (e, user) => {
        e.stopPropagation();
        setDeleteConfirm(user.uid);
    };

    const handleConfirmDelete = async (e, user) => {
        e.stopPropagation();
        try {
            if (onDeleteChat) {
                await onDeleteChat(user.uid);
            }
            setDeleteConfirm(null);
            
            if (selectedUser?.uid === user.uid) {
                onSelectUser(null);
            }
        } catch (error) {
            console.error('Error in handleConfirmDelete:', error);
        }
    };

    const handleCancelDelete = (e) => {
        e.stopPropagation();
        setDeleteConfirm(null);
    };

    const toggleMobileSearch = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
        if (isMobileSearchOpen) {
            setSearchQuery('');
        }
    };

    return (
        <div className="w-full sm:w-80 md:w-1/4 lg:w-1/3 xl:w-1/4 2xl:w-2/5 mt-4 bg-white border-r border-gray-200/60 overflow-hidden flex flex-col shadow-lg backdrop-blur-sm h-screen">
            {/* Header with responsive design */}
            <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200/60 bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/80 backdrop-blur-sm">
                {/* Mobile/Tablet Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl sm:rounded-2xl"></div>
                        </div>
                        <div className="hidden sm:block">
                            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Messages</h2>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">{users.length} {users.length === 1 ? 'contact' : 'contacts'}</p>
                        </div>
                        <div className="sm:hidden">
                            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Chat</h2>
                        </div>
                    </div>
                    
                    {/* Mobile Search Toggle */}
                    <button
                        onClick={toggleMobileSearch}
                        className="sm:hidden p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Search Bar - responsive visibility */}
                <div className={`relative group transition-all duration-300 ${
                    isMobileSearchOpen ? 'block' : 'hidden sm:block'
                }`}>
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none transition-all duration-200 group-focus-within:text-indigo-500">
                        <svg className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200/80 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-300/50 focus:border-indigo-400 bg-white/80 backdrop-blur-sm shadow-sm text-sm transition-all duration-300 placeholder-gray-400 hover:border-gray-300 hover:shadow-md group"
                    />
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    
                    {/* Mobile close search */}
                    {isMobileSearchOpen && (
                        <button
                            onClick={toggleMobileSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 sm:hidden"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* User List - responsive scrolling */}
            <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide">
                <style jsx>{`
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                
                <ul className="divide-y divide-gray-100/60">
                    {filteredUsers.map((user, index) => {
                        const userLastMessage = lastMessages[user.uid];
                        const isOnline = onlineStatus[user.uid];
                        const showDeleteConfirm = deleteConfirm === user.uid;
                        
                        return (
                            <li
                                key={user.uid}
                                onClick={() => !showDeleteConfirm && onSelectUser(user)}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className={`group relative transition-all duration-300 animate-in fade-in slide-in-from-left-2 ${
                                    showDeleteConfirm 
                                        ? 'bg-red-50 border-l-4 border-red-400'
                                        : `cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/30 ${
                                            selectedUser?.uid === user.uid
                                                ? 'bg-gradient-to-r from-indigo-50 via-purple-50/30 to-pink-50/20 border-r-2 sm:border-r-4 border-indigo-500 shadow-inner'
                                                : 'hover:shadow-sm'
                                        }`
                                }`}
                            >
                                {showDeleteConfirm ? (
                                    // Delete Confirmation UI - responsive
                                    <div className="p-3 sm:p-4">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1 truncate">
                                                    Delete chat with {user.username || user.email.split('@')[0]}?
                                                </p>
                                                <p className="text-xs text-gray-500 hidden sm:block">This action cannot be undone.</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2 mt-2 sm:mt-3">
                                            <button
                                                onClick={handleCancelDelete}
                                                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md sm:rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={(e) => handleConfirmDelete(e, user)}
                                                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white bg-red-600 rounded-md sm:rounded-lg hover:bg-red-700 transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Normal User Item UI - responsive
                                    <div className="p-3 sm:p-4">
                                        <div className="flex items-center space-x-3">
                                            {/* Avatar - responsive sizing */}
                                            <div className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 bg-gradient-to-br ${getRandomColor(user.email)} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                                                <span className="text-white font-bold text-sm sm:text-base md:text-lg tracking-tight">{getInitials(user)}</span>
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl sm:rounded-2xl"></div>
                                                
                                                {/* Online Status - responsive */}
                                                {isOnline && (
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-400 border-2 border-white rounded-full shadow-md">
                                                        <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse"></div>
                                                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* User Info - responsive */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold text-gray-800 truncate group-hover:text-indigo-700 transition-colors duration-300 text-sm sm:text-base">
                                                        {user.username || user.email.split('@')[0]}
                                                    </p>
                                                    {userLastMessage?.timestamp && (
                                                        <span className="text-xs text-gray-400 font-medium flex-shrink-0 bg-gray-100/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ml-2">
                                                            {formatTimestamp(userLastMessage.timestamp)}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-[150px] md:max-w-[180px] group-hover:text-gray-600 transition-colors duration-300">
                                                        {userLastMessage?.lastMessage 
                                                            ? formatLastMessage(userLastMessage.lastMessage) 
                                                            : (
                                                                <span className="italic text-gray-400 flex items-center">
                                                                    <svg className="w-3 h-3 mr-1 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    <span className="sm:hidden">Start chat</span>
                                                                    <span className="hidden sm:inline">Start chatting</span>
                                                                </span>
                                                            )}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center space-x-1 sm:space-x-2 mt-1 sm:mt-2">
                                                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${isOnline ? 'bg-emerald-400 shadow-sm animate-pulse' : 'bg-gray-300'}`}></div>
                                                    <span className={`text-xs font-medium transition-colors duration-300 ${
                                                        isOnline 
                                                            ? '' 
                                                            : 'text-gray-500'
                                                    }`}>
                                                        <span className="sm:hidden">{isOnline ? 'Online' : 'Offline'}</span>
                                                        <span className="hidden sm:inline">{isOnline ? 'Active now' : 'Offline'}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Buttons - responsive */}
                                            <div className="flex items-center space-x-1 sm:space-x-2">
                                                {/* Delete Button */}
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, user)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 sm:p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md sm:rounded-lg transition-all duration-200 transform hover:scale-105"
                                                    title="Delete conversation"
                                                >
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>

                                                {/* Hover indicator - hidden on mobile */}
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selected indicator */}
                                        {selectedUser?.uid === user.uid && (
                                            <div className="absolute bottom-0 left-3 sm:left-4 right-3 sm:right-4 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

                {/* Empty state - responsive */}
                {filteredUsers.length === 0 && (
                    <div className="p-6 sm:p-8 text-center animate-in fade-in duration-500">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-inner">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-semibold text-base sm:text-lg mb-2">No conversations found</p>
                        <p className="text-gray-400 text-sm leading-relaxed px-2">
                            {searchQuery ? `No results for "${searchQuery}"` : 'Start a new conversation to get chatting'}
                        </p>
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="mt-3 sm:mt-4 text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors duration-200 underline-offset-2 hover:underline"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* Footer - responsive */}
                {filteredUsers.length > 0 && (
                    <div className="p-3 sm:p-4 border-t border-gray-100/60 bg-gradient-to-r from-gray-50/50 to-indigo-50/30 backdrop-blur-sm">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full opacity-60"></div>
                            <p className="text-xs text-gray-500 font-medium">
                                {searchQuery
                                    ? `${filteredUsers.length} of ${users.length}`
                                    : `${users.length} total`}
                                <span className="hidden sm:inline"> contacts</span>
                            </p>
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full opacity-60"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;