import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import BlockedUsersList from './BlockedUsersList';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const Chat = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onlineStatus, setOnlineStatus] = useState({});
    const [lastMessages, setLastMessages] = useState({});
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [blockedUsersData, setBlockedUsersData] = useState([]);
    const [isChatBlocked, setIsChatBlocked] = useState(false);
    const [showBlockedUsers, setShowBlockedUsers] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    useOnlineStatus(user);

    // Initialize dark mode from localStorage
    // useEffect(() => {
    //     const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    //     setDarkMode(savedDarkMode);
    //     if (savedDarkMode) {
    //         document.documentElement.classList.add('dark');
    //     }
    // }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Add notification
    const addNotification = (message, type = 'info') => {
        const id = Date.now();
        const notification = { id, message, type };
        setNotifications(prev => [...prev, notification]);
        
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
    };

    // Online status
    useEffect(() => {
        const statusRef = collection(db, 'status');
        const unsubscribe = onSnapshot(statusRef, (snapshot) => {
            const statuses = {};
            const now = Date.now();

            snapshot.forEach((doc) => {
                const sessions = doc.data()?.sessions || {};
                const activeSessions = Object.values(sessions).filter(
                    s => s.lastActive?.toMillis && (now - s.lastActive.toMillis()) < 60000
                );
                statuses[doc.id] = activeSessions.length > 0;
            });

            setOnlineStatus(statuses);
        });

        return () => unsubscribe();
    }, []);

    // Fetch blocked users
    useEffect(() => {
        if (!user) return;
        const blockedUsersRef = collection(db, 'users', user.uid, 'blockedUsers');
        const unsubscribe = onSnapshot(blockedUsersRef, async (snapshot) => {
            const blockedIds = snapshot.docs.map(doc => doc.id);
            setBlockedUsers(blockedIds);

            const blockedUsersFullData = [];
            for (const blockedId of blockedIds) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', blockedId));
                    if (userDoc.exists()) {
                        blockedUsersFullData.push({ uid: blockedId, ...userDoc.data() });
                    }
                } catch (error) {
                    console.error('Error fetching blocked user:', error);
                }
            }
            setBlockedUsersData(blockedUsersFullData);
        }, (error) => {
            console.error('Error in blocked users listener:', error);
        });
        return () => unsubscribe();
    }, [user.uid]);

    // Check if chat is blocked
    useEffect(() => {
        if (!selectedUser || !user) {
            setIsChatBlocked(false);
            return;
        }

        const checkIfBlocked = async () => {
            const iBlockedThem = blockedUsers.includes(selectedUser.uid);
            const theyBlockedMeRef = doc(db, 'users', selectedUser.uid, 'blockedUsers', user.uid);
            const docSnap = await getDoc(theyBlockedMeRef);
            const theyBlockedMe = docSnap.exists();
            setIsChatBlocked(iBlockedThem || theyBlockedMe);
        };

        checkIfBlocked();
    }, [selectedUser, blockedUsers, user.uid]);

    // Fetch users
    useEffect(() => {
        setIsLoading(true);
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("uid", "!=", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const usersData = querySnapshot.docs.map(doc => doc.data());
            setUsers(usersData);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [user.uid]);



/ ------------------- CORRECTED SECTION START ------------------- //
    
    // EFFECT 1: Fetch real-time last message data for all users.
    // This now correctly handles when a chat is deleted by the other user.
    useEffect(() => {
        if (users.length === 0 || !user.uid) return;
    
        const unsubscribes = users.map(otherUser => {
            const chatId = [user.uid, otherUser.uid].sort().join('_');
            const chatMetaRef = doc(db, 'chatMeta', chatId);
    
            return onSnapshot(chatMetaRef, (docSnapshot) => {
                setLastMessages(prevLastMessages => {
                    const newLastMessages = { ...prevLastMessages };
                    if (docSnapshot.exists()) {
                        const chatData = docSnapshot.data();
                        newLastMessages[otherUser.uid] = {
                            lastMessage: chatData.lastMessage,
                            timestamp: chatData.lastMessageTime?.toMillis() || 0
                        };
                    } else {
                        // This handles the real-time deletion.
                        // The chat meta doesn't exist, so we clear the last message.
                        newLastMessages[otherUser.uid] = {
                            lastMessage: null,
                            timestamp: 0
                        };
                    }
                    return newLastMessages;
                });
            });
        });
    
        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [users.length, user.uid]); // Depends on the initial user load
    
    // EFFECT 2: Sort users whenever the last message data changes.
    // Separating this logic makes it more reliable and efficient.
    useEffect(() => {
        if (Object.keys(lastMessages).length === 0) return;
    
        setUsers(currentUsers => {
            const sortedUsers = [...currentUsers].sort((a, b) => {
                const aTime = lastMessages[a.uid]?.timestamp || 0;
                const bTime = lastMessages[b.uid]?.timestamp || 0;
                return bTime - aTime;
            });
            return sortedUsers;
        });
    }, [lastMessages]);
    
    // -------------------- CORRECTED SECTION END -------------------- //




    // Fetch chat messages
    useEffect(() => {
        if (!selectedUser) {
            setMessages([]);
            return;
        };
        const chatId = [user.uid, selectedUser.uid].sort().join('_');
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData);
        });
        return () => unsubscribe();
    }, [selectedUser, user.uid]);

    // Send message
    const handleSendMessage = async (text) => {
        if (!selectedUser || isChatBlocked) return;

        try {
            const chatId = [user.uid, selectedUser.uid].sort().join('_');
            const messagesRef = collection(db, 'chats', chatId, 'messages');

            await addDoc(messagesRef, {
                text,
                senderId: user.uid,
                receiverId: selectedUser.uid,
                timestamp: serverTimestamp(),
                deleted: false,
            });

            const chatMetaRef = doc(db, 'chatMeta', chatId);
            await setDoc(chatMetaRef, {
                participants: [user.uid, selectedUser.uid],
                lastMessage: text,
                lastMessageTime: serverTimestamp(),
                lastSender: user.uid
            }, { merge: true });

            addNotification('Message sent successfully', 'success');
        } catch (error) {
            console.error('Error sending message:', error);
            addNotification('Failed to send message', 'error');
        }
    };

    // Block / Unblock
    const handleBlockUser = async (userIdToBlock) => {
        if (!userIdToBlock) return;
        
        try {
            const blockRef = doc(db, 'users', user.uid, 'blockedUsers', userIdToBlock);
            await setDoc(blockRef, { blockedAt: serverTimestamp() });
            if (selectedUser && selectedUser.uid === userIdToBlock) {
                setSelectedUser(null);
            }
            addNotification('User blocked successfully', 'success');
        } catch (error) {
            console.error('Error blocking user:', error);
            addNotification('Failed to block user', 'error');
        }
    };

    const handleUnblockUser = async (userIdToUnblock) => {
        if (!userIdToUnblock) return;
        
        try {
            const blockRef = doc(db, 'users', user.uid, 'blockedUsers', userIdToUnblock);
            await deleteDoc(blockRef);
            addNotification('User unblocked successfully', 'success');
        } catch (error) {
            console.error('Error unblocking user:', error);
            addNotification('Failed to unblock user', 'error');
        }
    };

    // Delete message
    const handleDeleteMessage = async (messageId) => {
        if (!selectedUser) return;
        
        try {
            const chatId = [user.uid, selectedUser.uid].sort().join('_');
            const messageRef = doc(db, 'chats', chatId, 'messages', messageId);

            await updateDoc(messageRef, {
                text: "This message was deleted.",
                deleted: true,
            });

            addNotification('Message deleted', 'success');
        } catch (error) {
            console.error('Error deleting message:', error);
            addNotification('Failed to delete message', 'error');
        }
    };

    // Report message
    const handleReportMessage = async (messageId, senderId) => {
        try {
            const reportRef = collection(db, 'reports');
            await addDoc(reportRef, {
                messageId,
                reportedUserId: senderId,
                reportedBy: user.uid,
                timestamp: serverTimestamp(),
                reason: 'inappropriate_content'
            });
            addNotification('Message reported successfully', 'success');
        } catch (error) {
            console.error('Error reporting message:', error);
            addNotification('Failed to report message', 'error');
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            addNotification('Logged out successfully', 'success');
        } catch (error) {
            console.error('Error logging out:', error);
            addNotification('Failed to log out', 'error');
        }
    };

    const isSelectedUserBlocked = selectedUser ? blockedUsers.includes(selectedUser.uid) : false;

    // Get user initials for profile
    const getUserInitials = (email, username) => {
        if (username) return username.charAt(0).toUpperCase();
        return email.charAt(0).toUpperCase();
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center animate-pulse">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-700">Loading your conversations...</p>
                        <p className="text-sm text-gray-500">Please wait while we set things up</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex h-screen font-sans antialiased transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'}`}>
            {/* Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`p-4 rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 animate-in slide-in-from-right ${
                            notification.type === 'success' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : notification.type === 'error'
                            ? 'bg-rose-50 border-rose-200 text-rose-800'
                            : 'bg-blue-50 border-blue-200 text-blue-800'
                        }`}
                    >
                        <div className="flex items-center space-x-2">
                            {notification.type === 'success' && (
                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {notification.type === 'error' && (
                                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            <span className="font-medium text-sm">{notification.message}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`flex flex-col w-full max-w-5xl  mx-auto shadow-2xl rounded-2xl overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Enhanced Header */}
                <header className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-b border-indigo-700 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                    <div className="relative flex items-center justify-between p-3">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                    Firebase Chat
                                </h1>
                                <p className="text-sm text-white/70 font-medium">
                                    Real-time messaging platform
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* User Profile */}
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
                                <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {getUserInitials(user.email, user.username)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {user.username || user.email.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-white/70">{user.email}</p>
                                </div>
                            </div>

                            {/* Blocked Users Button */}
                            {blockedUsersData.length > 0 && (
                                <button
                                    onClick={() => setShowBlockedUsers(!showBlockedUsers)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-rose-500/90 hover:bg-rose-600 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-105 border border-white/20 shadow-lg"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                    </svg>
                                    <span className="font-medium">Blocked ({blockedUsersData.length})</span>
                                </button>
                            )}

                            {/* Logout Button */}
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-medium transition-all duration-200 hover:scale-105 border border-white/20 shadow-lg"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Decorative gradient line */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </header>

                {/* Main Layout */}
                <div className={`flex flex-1 overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    {/* Left: User List */}
                    <UserList
                        users={users}
                        onSelectUser={setSelectedUser}
                        selectedUser={selectedUser}
                        onlineStatus={onlineStatus}
                        lastMessages={lastMessages}
                        blockedUsers={blockedUsers}
                        onBlockUser={handleBlockUser}
                        onUnblockUser={handleUnblockUser}
                        onDeleteChat={async (userId) => {
                            try {
                                const chatId = [user.uid, userId].sort().join('_');
                                
                                const messagesRef = collection(db, 'chats', chatId, 'messages');
                                const messagesSnapshot = await getDocs(messagesRef);
                                const batch = writeBatch(db);
                                
                                messagesSnapshot.forEach((doc) => {
                                    batch.delete(doc.ref);
                                });
                                
                                const chatMetaRef = doc(db, 'chatMeta', chatId);
                                batch.delete(chatMetaRef);
                                
                                await batch.commit();

                                // THIS IS THE FIX: Update the local UI state after DB deletion
                                setUsers(currentUsers => currentUsers.filter(u => u.uid !== userId));
                                
                                if (selectedUser?.uid === userId) {
                                    setSelectedUser(null);
                                }
                                
                                addNotification('Chat deleted successfully', 'success');
                            } catch (error) {
                                console.error('Error deleting chat:', error);
                                addNotification('Failed to delete chat', 'error');
                            }
                        }}
                    />

                    {/* Center: Chat Window */}
                    <div className="flex flex-col flex-1 min-h-0">
                        <ChatWindow
                            user={user}
                            selectedUser={selectedUser}
                            messages={messages}
                            onlineStatus={onlineStatus}
                            onBlockUser={() => handleBlockUser(selectedUser?.uid)}
                            onDeleteMessage={handleDeleteMessage}
                            onReportMessage={handleReportMessage}
                            isBlocked={isChatBlocked}
                            isUserBlocked={isSelectedUserBlocked}
                        />
                        
                        {/* Message Input or Blocked State */}
                        {selectedUser && !isChatBlocked && (
                            <MessageInput onSendMessage={handleSendMessage} />
                        )}
                        
                        {selectedUser && isChatBlocked && (
                            <div className={`p-6 border-t transition-colors duration-300 ${
                                darkMode 
                                ? 'bg-gray-900/50 border-gray-700' 
                                : 'bg-gradient-to-r from-gray-50 to-indigo-50/30 border-gray-200'
                            }`}>
                                <div className="max-w-md mx-auto text-center space-y-4">
                                    <div className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center ${
                                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                    }`}>
                                        <svg className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                        </svg>
                                    </div>
                                    <div className="space-y-2">
                                        <p className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {isSelectedUserBlocked
                                                ? "You have blocked this user"
                                                : "This user has blocked you"
                                            }
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                            {isSelectedUserBlocked
                                                ? "You won't receive messages from this user until you unblock them."
                                                : "You cannot send messages to this user."
                                            }
                                        </p>
                                    </div>
                                    {isSelectedUserBlocked && (
                                        <button
                                            onClick={() => handleUnblockUser(selectedUser.uid)}
                                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                                        >
                                            Unblock User
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Blocked Users List */}
                    {showBlockedUsers && (
                        <div className="animate-in slide-in-from-right duration-300">
                            <BlockedUsersList
                                blockedUsers={blockedUsersData}
                                onUnblockUser={handleUnblockUser}
                                onSelectUser={(user) => {
                                    setSelectedUser(user);
                                    setShowBlockedUsers(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;