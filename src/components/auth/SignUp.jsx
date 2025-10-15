import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

const SignUp = ({ setHasAccount }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Add user to the 'users' collection in Firestore with username
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                username: username || email.split('@')[0] // fallback to email username if no username provided
            });
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-300">
                    {/* Organic flowing shapes */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        <svg viewBox="0 0 400 600" className="w-full h-full">
                            <defs>
                                <linearGradient id="signupGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="50%" stopColor="#8B5CF6" />
                                    <stop offset="100%" stopColor="#EC4899" />
                                </linearGradient>
                                <linearGradient id="signupGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#8B5CF6" />
                                    <stop offset="100%" stopColor="#F472B6" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,120 C60,100 120,140 180,120 C240,100 300,140 360,120 C400,100 400,130 400,170 L400,370 C360,350 300,390 240,370 C180,350 120,390 60,370 C0,350 0,380 0,360 Z"
                                fill="url(#signupGradient1)"
                                opacity="0.7"
                            />
                            <path
                                d="M0,220 C90,200 180,240 270,220 C360,200 400,240 400,270 L400,470 C360,450 270,490 180,470 C90,450 0,490 0,460 Z"
                                fill="url(#signupGradient2)"
                                opacity="0.5"
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
                            Join Our<br />Community!
                        </h1>
                        <p className="text-white/80 text-lg">
                            Create your account and start connecting
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - SignUp Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
                        <p className="text-gray-600">Create your account to get started.</p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@gmail.com"
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

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                'Sign Up'
                            )}
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-gray-600">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => setHasAccount(true)}
                                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                            >
                                Log In
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;