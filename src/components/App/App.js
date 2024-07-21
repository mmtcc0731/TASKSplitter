import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Sidebar from '../Sidebar/Sidebar';
import MainContent from '../MainContent/MainContent';
import { ThemeProvider } from '../../contexts/ThemeContext';
import ToggleSidebar from '../ToggleSidebar/ToggleSidebar';
import { Login, Logout } from '../Auth/Auth';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './App.css';
import '../../contexts/DarkMode.css';
import '../../contexts/SepiaMode.css';
import '../../contexts/ForestMode.css';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContentWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '0' : '0px')};
`;

const App = () => {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState(['研究室', 'バイト先', 'インターン先']);
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadUserData = useCallback(async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      setWorkspaces(data.workspaces || ['研究室', 'バイト先', 'インターン先']);
      setActiveWorkspace(data.activeWorkspace || data.workspaces[0] || '研究室');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [loadUserData]);

  const saveUserData = useCallback(async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        workspaces,
        activeWorkspace
      }, { merge: true });
    }
  }, [user, workspaces, activeWorkspace]);

  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [user, saveUserData]);

  const addWorkspace = useCallback((name) => {
    if (name && !workspaces.includes(name)) {
      setWorkspaces(prevWorkspaces => [...prevWorkspaces, name]);
    }
  }, [workspaces]);

  const editWorkspace = useCallback((oldName, newName) => {
    if (newName && oldName !== newName && !workspaces.includes(newName)) {
      setWorkspaces(prevWorkspaces => prevWorkspaces.map(w => w === oldName ? newName : w));
      setActiveWorkspace(prevActiveWorkspace => prevActiveWorkspace === oldName ? newName : prevActiveWorkspace);
    }
  }, [workspaces]);

  const deleteWorkspace = useCallback((name) => {
    setWorkspaces(prevWorkspaces => {
      const updatedWorkspaces = prevWorkspaces.filter(w => w !== name);
      setActiveWorkspace(prevActiveWorkspace =>
        prevActiveWorkspace === name ? updatedWorkspaces[0] || null : prevActiveWorkspace
      );
      return updatedWorkspaces;
    });
  }, []);

  const handleSidebarToggle = useCallback((isOpen) => {
    setSidebarOpen(isOpen);
  }, []);

  const handleLogin = useCallback((loggedInUser) => {
    setUser(loggedInUser);
    loadUserData(loggedInUser.uid);
  }, [loadUserData]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setWorkspaces(['研究室', 'バイト先', 'インターン先']);
    setActiveWorkspace('研究室');
  }, []);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <AppContainer>
        <ToggleSidebar onToggle={handleSidebarToggle}>
          <Sidebar
            workspaces={workspaces}
            activeWorkspace={activeWorkspace}
            setActiveWorkspace={setActiveWorkspace}
            addWorkspace={addWorkspace}
            editWorkspace={editWorkspace}
            deleteWorkspace={deleteWorkspace}
          />
        </ToggleSidebar>
        <MainContentWrapper $sidebarOpen={sidebarOpen}>
          <Logout onLogout={handleLogout} />
          <MainContent
            activeWorkspace={activeWorkspace}
          />
        </MainContentWrapper>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;