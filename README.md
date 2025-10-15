# 🚀 Firebase Real-Time Chat Application

A modern, feature-rich real-time chat application built with React, Firebase, and Tailwind CSS. This application provides seamless messaging with user management, blocking capabilities, and real-time status updates.

![Firebase Chat App](https://img.shields.io/badge/React-18.3.1-blue)
![Firebase](https://img.shields.io/badge/Firebase-11.1.0-orange)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 💬 **Real-Time Messaging**
- Instant message delivery using Firebase Firestore
- Message read receipts and timestamps
- Real-time message synchronization across devices
- Last message preview in user list

### 👥 **User Management**
- User authentication with Firebase Auth
- Email/Password sign up and login
- Custom usernames
- User profile with initials avatar
- Random gradient avatars for visual appeal

### 🚫 **Blocking & Privacy**
- Block/Unblock users
- Blocked users list with management
- Prevent messaging from/to blocked users
- Privacy-focused chat experience

### 🟢 **Online Status**
- Real-time online/offline status indicators
- Multi-session support
- Last active tracking
- Visual status indicators (green dots)

### 🗑️ **Chat Management**
- Delete individual messages
- Delete entire chat conversations
- Report inappropriate messages
- Message deletion with tombstone ("This message was deleted")

### 🎨 **Modern UI/UX**
- Beautiful gradient designs
- Smooth animations and transitions
- Responsive mobile-first design
- Loading states and skeletons
- Toast notifications for actions
- Dark mode ready (commented in code)

### 🔒 **Security**
- Firebase Security Rules implementation
- User data protection
- Authenticated requests only
- Secure message storage

---

## 🛠️ Tech Stack

### Frontend
- **React** (v18.3.1) - UI library
- **Vite** (v6.0.5) - Build tool & dev server
- **Tailwind CSS** (v3.4.17) - Styling
- **React Router** - Navigation

### Backend & Database
- **Firebase Authentication** - User auth
- **Firebase Firestore** - Real-time database
- **Firebase Hosting** (optional) - Deployment

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 📁 Project Structure

chat-app/
├── public/
├── src/
│ ├── components/
│ │ ├── auth/
│ │ │ ├── Login.jsx
│ │ │ └── SignUp.jsx
│ │ └── chat/
│ │ ├── Chat.jsx
│ │ ├── ChatWindow.jsx
│ │ ├── ChatHeader.jsx
│ │ ├── MessageInput.jsx
│ │ ├── UserList.jsx
│ │ └── BlockedUsersList.jsx
│ ├── firebase/
│ │ └── config.js
│ ├── hooks/
│ │ └── useOnlineStatus.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md



---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Firebase Account** ([Create one here](https://firebase.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/firebase-chat-app.git
   cd firebase-chat-app
