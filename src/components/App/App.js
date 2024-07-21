import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../Sidebar/Sidebar';
import MainContent from '../MainContent/MainContent';
import { ThemeProvider } from '../../contexts/ThemeContext';
import ToggleSidebar from '../ToggleSidebar/ToggleSidebar';
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
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? '0' : '0px')};  // 250px - 16px (トグルボタンの幅)
`;

const App = () => {
  const [workspaces, setWorkspaces] = useState(() => {
    const savedWorkspaces = localStorage.getItem('workspaces');
    return savedWorkspaces ? JSON.parse(savedWorkspaces) : ['研究室', 'バイト先', 'インターン先'];
  });
  const [activeWorkspace, setActiveWorkspace] = useState(() => {
    return localStorage.getItem('activeWorkspace') || workspaces[0];
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('activeWorkspace', activeWorkspace);
  }, [activeWorkspace]);

  const addWorkspace = (name) => {
    if (name && !workspaces.includes(name)) {
      setWorkspaces([...workspaces, name]);
    }
  };

  const editWorkspace = (oldName, newName) => {
    if (newName && oldName !== newName && !workspaces.includes(newName)) {
      const updatedWorkspaces = workspaces.map(w => w === oldName ? newName : w);
      setWorkspaces(updatedWorkspaces);
      if (activeWorkspace === oldName) {
        setActiveWorkspace(newName);
      }
    }
  };

  const deleteWorkspace = (name) => {
    const updatedWorkspaces = workspaces.filter(w => w !== name);
    setWorkspaces(updatedWorkspaces);
    if (activeWorkspace === name) {
      setActiveWorkspace(updatedWorkspaces[0] || null);
    }
  };

  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

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
        <MainContentWrapper sidebarOpen={sidebarOpen}>
          <MainContent
            activeWorkspace={activeWorkspace}
          />
        </MainContentWrapper>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;