import React, { useState } from 'react';
import { UserMinusIcon, EllipsisVerticalIcon, PhoneIcon, VideoCameraIcon } from '@heroicons/react/24/solid';

const ChatHeader = ({ selectedUser, onlineStatus, onBlockUser, getRandomColor }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);

    const handleBlockUser = async () => {
        setIsBlocking(true);
        try {
            await onBlockUser();
        } finally {
            setIsBlocking(false);
            setShowDropdown(false);
        }
    };

    const getLastSeen = () => {
        if (onlineStatus) return 'Active now';
        // You can enhance this with actual last seen data
        return 'Last seen recently';
    };

    return (
        <div className="px-6 mt-25  py-3 w-full  border-b border-gray-200/60 bg-gradient-to-r  from-white via-gray-50/30 to-white shadow-sm backdrop-blur-sm flex justify-between items-center ">
            {/* User Info Section */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* Enhanced Avatar */}
                <div className="relative group">
                    <div className={`relative w-12 h-12 bg-gradient-to-br ${getRandomColor(selectedUser.email)} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                        <span className="text-white font-bold text-lg tracking-tight">
                            {selectedUser.username ? selectedUser.username.charAt(0).toUpperCase() : selectedUser.email.charAt(0).toUpperCase()}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                    </div>
                    
                    {/* Enhanced Online Status */}
                    {onlineStatus && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-md">
                            <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                        </div>
                    )}
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-semibold  truncate bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            {selectedUser.username || selectedUser.email.split('@')[0]}
                        </h2>
                        {onlineStatus && (
                            <div className="flex items-center space-x-1 bg-emerald-50 px-2 py-1 rounded-full">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium text-emerald-600">Online</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                        <p className={`text-sm font-medium transition-colors duration-200 ${
                            onlineStatus 
                                ? 'text-emerald-600' 
                                : 'text-gray-500'
                        }`}>
                            {getLastSeen()}
                        </p>
                        {onlineStatus && (
                            <div className="flex items-center space-x-1">
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <span className="text-xs text-gray-400 font-medium">Typing indicator here</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
                {/* Call Buttons */}
                <div className="flex items-center space-x-1">
                    <button 
                        className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300/50 shadow-sm hover:shadow-md"
                        title="Voice call"
                    >
                        <PhoneIcon className="h-5 w-5" />
                    </button>
                    <button 
                        className="w-10 h-10 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300/50 shadow-sm hover:shadow-md"
                        title="Video call"
                    >
                        <VideoCameraIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* More Options Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300/50 shadow-sm hover:shadow-md"
                        title="More options"
                    >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>

                    {/* Enhanced Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-gray-200/60 backdrop-blur-sm z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2">
                                <button
                                    onClick={() => setShowDropdown(false)}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-150"
                                >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="font-medium">View Profile</span>
                                </button>
                                
                                <button
                                    onClick={() => setShowDropdown(false)}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-150"
                                >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
                                    </svg>
                                    <span className="font-medium">Media & Files</span>
                                </button>

                                <button
                                    onClick={() => setShowDropdown(false)}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-150"
                                >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span className="font-medium">Mute Notifications</span>
                                </button>

                                <hr className="my-2 border-gray-200/60" />

                                <button
                                    onClick={handleBlockUser}
                                    disabled={isBlocking}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isBlocking ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="font-medium">Blocking...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserMinusIcon className="h-4 w-4" />
                                            <span className="font-medium">Block User</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {showDropdown && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                />
            )}

            {/* Subtle bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent"></div>
        </div>
    );
};

export default ChatHeader;