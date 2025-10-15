import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';

const Login = ({ setHasAccount }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Decorative Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background with organic shapes */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200">
                    {/* Organic flowing shapes */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        <svg viewBox="0 0 400 600" className="w-full h-full">
                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#8B5CF6" />
                                    <stop offset="50%" stopColor="#A855F7" />
                                    <stop offset="100%" stopColor="#EC4899" />
                                </linearGradient>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,100 C50,80 100,120 150,100 C200,80 250,120 300,100 C350,80 400,120 400,150 L400,350 C350,330 300,370 250,350 C200,330 150,370 100,350 C50,330 0,370 0,340 Z"
                                fill="url(#gradient1)"
                                opacity="0.8"
                            />
                            <path
                                d="M0,200 C80,180 160,220 240,200 C320,180 400,220 400,250 L400,450 C320,430 240,470 160,450 C80,430 0,470 0,440 Z"
                                fill="url(#gradient2)"
                                opacity="0.6"
                            />
                        </svg>
                    </div>
                </div>

                {/* Logo */}
                <div className="absolute top-8 left-8 z-10">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                </div>

                {/* Welcome Text */}
                <div className="flex items-center justify-center w-full h-full z-10 relative">
                    <div className="text-center text-white px-8">
                        <h1 className="text-5xl font-bold mb-4 leading-tight">
                            Welcome<br />Back!
                        </h1>
                        <p className="text-white/80 text-lg">
                            Sign in to continue your conversations
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
                        <p className="text-gray-600">Welcome back! Please login to your account.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User Name
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="username@gmail.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-700">Remember Me</span>
                            </label>
                            <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Login'
                            )}
                        </button>

                        {/* Sign Up Link */}
                        <p className="text-center text-gray-600">
                            New User?{' '}
                            <button
                                type="button"
                                onClick={() => setHasAccount(false)}
                                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                            >
                                Signup
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;