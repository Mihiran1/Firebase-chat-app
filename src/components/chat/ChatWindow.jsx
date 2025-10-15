import React, { useRef, useEffect } from 'react';
import Welcome from './Welcome';
import ChatHeader from './ChatHeader';
import Message from './Message';

const ChatWindow = ({ user, selectedUser, messages, onlineStatus, onBlockUser, onDeleteMessage, isBlocked }) => {
    const messagesEndRef = useRef(null);

    const getRandomColor = (email) => {
        const colors = ['from-blue-400 to-blue-500', 'from-green-400 to-green-500', 'from-purple-400 to-purple-500', 'from-pink-400 to-pink-500', 'from-yellow-400 to-yellow-500', 'from-indigo-400 to-indigo-500', 'from-red-400 to-red-500', 'from-teal-400 to-teal-500'];
        if (!email) return colors[0];
        const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    if (!selectedUser) {
        return <Welcome />;
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white  mt-0">
            <ChatHeader 
                selectedUser={selectedUser}
                onlineStatus={onlineStatus[selectedUser.uid]}
                onBlockUser={onBlockUser}
                getRandomColor={getRandomColor}
            />
            
            <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;
                        return (
                            <Message 
                                key={msg.id}
                                message={msg}
                                currentUser={user}
                                selectedUser={selectedUser}
                                onDelete={onDeleteMessage}
                                showAvatar={showAvatar}
                                getRandomColor={getRandomColor}
                            />
                        );
                    })}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {isBlocked && (
                 <div className="p-4 border-t border-gray-200 text-center  bg-red-50 text-red-700 font-medium text-sm">
                    You can no longer chat with this user.
                </div>
            )}
        </div>
    );
};

export default ChatWindow;