import React, { useState, useEffect } from 'react';

const Welcome = () => {
    const [currentTip, setCurrentTip] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const tips = [
        "💬 Click on any user to start a conversation",
        "🔍 Use the search bar to find specific contacts",
        "🚫 Block users if needed from the chat options",
        "🌙 Toggle dark mode from the header settings",
        "📱 Enjoy real-time messaging with instant delivery"
    ];

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % tips.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [tips.length]);

    return (
        <div className="flex-1 flex items-center justify-center pb-40 bg-graient-to-br from-slate-50 via-indigo-50/30 to-purple-d50/50 relative overflow-hidden  pt-35">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Main Content */}
            <div className={`text-center space-y-8 max-w-md mx-auto px-6 transition-all duration-1000 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
                
                {/* Enhanced Icon */}
                <div className="relative mx-auto w-20 h-20 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl">
                        <svg className="w-14 h-14 text-white transform transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute -bottom-1 -left-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
                </div>

                {/* Enhanced Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent leading-tight">
                        Welcome to Chat
                    </h1>
                    <div className="space-y-3">
                        <p className="text-xl font-semibold text-gray-700">
                            Ready to Connect?
                        </p>
                        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
                            Select a contact from the sidebar to start your conversation. 
                            Experience real-time messaging at its finest.
                        </p>
                    </div>
                </div>

                {/* Rotating Tips */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-700">Quick Tip</h3>
                    </div>
                    <div className="relative h-6 overflow-hidden">
                        {tips.map((tip, index) => (
                            <p
                                key={index}
                                className={`absolute inset-0 text-sm text-gray-600 transition-all duration-500 transform ${
                                    index === currentTip 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-6'
                                }`}
                            >
                                {tip}
                            </p>
                        ))}
                    </div>
                    
                    {/* Tip Progress Indicator */}
                    <div className="flex justify-center space-x-1 mt-2">
                        {tips.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentTip 
                                        ? 'bg-indigo-400 w-6' 
                                        : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Action Hint */}
                <div className="flex items-center justify-center space-x-2 text-gray-400 animate-pulse">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    <span className="text-sm font-medium">Check out the sidebar to get started</span>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-3 gap-2 -pb-2">
                    <div className="text-center space-y-2 group">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-green-200 transition-all duration-300">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="text-xs font-semibold text-gray-600">Real-time</p>
                    </div>
                    <div className="text-center space-y-2 group">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="text-xs font-semibold text-gray-600">Secure</p>
                    </div>
                    <div className="text-center space-y-2 group">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-xs font-semibold text-gray-600">Friendly</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;