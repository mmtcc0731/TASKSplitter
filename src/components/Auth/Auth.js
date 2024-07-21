// src/components/Auth/Auth.js
import React from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export const Login = ({ onLogin }) => {
    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            onLogin(result.user);
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <button onClick={handleLogin}>Google でログイン</button>
    );
};

export const Logout = ({ onLogout }) => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            onLogout();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <button onClick={handleLogout}>ログアウト</button>
    );
};