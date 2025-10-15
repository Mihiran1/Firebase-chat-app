import React from 'react';

const BlockedUsersList = ({ blockedUsers, onUnblockUser, onSelectUser }) => {
    const getRandomColor = (email) => {
        const colors = [
            'from-blue-400 to-blue-500',
            'from-green-400 to-green-500',
            'from-purple-400 to-purple-500',
            'from-pink-400 to-pink-500',
            'from-yellow-400 to-yellow-500',
            'from-indigo-400 to-indigo-500',
            'from-red-400 to-red-500',
            'from-teal-400 to-teal-500'
        ];
        const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    // If no blocked users, don't render anything
    if (!blockedUsers || blockedUsers.length === 0) {
        return null;
    }

    return (
        <div className="w-full sm:w-80 md:w-96 bg-gray-50 border-r mt-4 sm:mt-30 border-gray-200 flex flex-col scrollbar-hide">
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-red-50">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                    </div>
                    <h2 className="text-xs sm:text-sm font-semibold text-red-700">Blocked Users</h2>
                    <span className="text-xs sm:text-sm text-red-600 bg-red-100 px-1.5 sm:px-2 py-0.5 rounded-full">
                        {blockedUsers.length}
                    </span>
                </div>
                <p className="text-xs sm:text-sm text-red-600 mt-1">Users you have blocked</p>
            </div>

            {/* Blocked Users List */}
            <div className="flex-1 overflow-y-auto p-1 sm:p-2 space-y-1">
                {blockedUsers.map((user) => (
                    <div
                        key={user.uid}
                        className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-all duration-200"
                    >
                        <div
                            className="flex items-center space-x-2 sm:space-x-3 flex-1 cursor-pointer"
                            onClick={() => onSelectUser && onSelectUser(user)}
                        >
                            <div className="relative">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${getRandomColor(user.email)} rounded-full flex items-center justify-center shadow-md`}>
                                    <span className="text-white font-semibold text-xs sm:text-sm">
                                        {user.email.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                                    <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                    {user.username || user.email.split('@')[0]}
                                </h3>
                                <p className="text-xs text-gray-500 truncate hidden sm:block">{user.email}</p>
                                <p className="text-xs text-red-500 font-medium">Blocked</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Unblock ${user.username || user.email}? You'll be able to receive messages from them again.`)) {
                                    onUnblockUser(user.uid);
                                }
                            }}
                            className="ml-1 sm:ml-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors flex items-center space-x-1"
                            title="Unblock user"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            <span className="hidden sm:inline">Unblock</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-2 sm:p-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                    <span className="hidden sm:inline">Click on a user to view chat history or unblock them</span>
                    <span className="sm:hidden">Tap user to view or unblock</span>
                </p>
            </div>
        </div>
    );
};

export default BlockedUsersList;