import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useOnlineStatus = (user) => {
    useEffect(() => {
        if (!user) return;

        const sessionId = Date.now().toString(); // unique per browser tab
        const userStatusRef = doc(db, 'status', user.uid);
        let interval;

        // Set online with lastActive timestamp
        const updateOnline = async () => {
            await setDoc(
                userStatusRef,
                {
                    sessions: {
                        [sessionId]: { lastActive: serverTimestamp() }
                    },
                    lastSeen: serverTimestamp()
                },
                { merge: true }
            );
        };

        // Remove this session on tab close
        const removeSession = async () => {
            const docSnap = await getDoc(userStatusRef);
            const sessions = docSnap.data()?.sessions || {};
            delete sessions[sessionId];
            await setDoc(userStatusRef, { sessions, lastSeen: serverTimestamp() }, { merge: true });
        };

        updateOnline();
        interval = setInterval(updateOnline, 30000); // heartbeat every 30s

        window.addEventListener('beforeunload', removeSession);

        return () => {
            clearInterval(interval);
            removeSession();
            window.removeEventListener('beforeunload', removeSession);
        };
    }, [user]);
};
