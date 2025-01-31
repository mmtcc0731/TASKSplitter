import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import MainContent from '../MainContent/MainContent';
import { ThemeProvider } from '../../contexts/ThemeContext';
import './App.css';
import '../../contexts/DarkMode.css';
import '../../contexts/SepiaMode.css';
import '../../contexts/ForestMode.css';

const App = () => {
  const [workspaces, setWorkspaces] = useState(() => {
    const savedWorkspaces = localStorage.getItem('workspaces');
    return savedWorkspaces ? JSON.parse(savedWorkspaces) : ['研究室', 'バイト先', 'インターン先'];
  });
  const [activeWorkspace, setActiveWorkspace] = useState(() => {
    return localStorage.getItem('activeWorkspace') || workspaces[0];
  });

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

  return (
    <ThemeProvider>
      <div className="app">
        <Sidebar
          workspaces={workspaces}
          activeWorkspace={activeWorkspace}
          setActiveWorkspace={setActiveWorkspace}
          addWorkspace={addWorkspace}
          editWorkspace={editWorkspace}
          deleteWorkspace={deleteWorkspace}
        />
        <div className="main-content-wrapper">
          <MainContent
            activeWorkspace={activeWorkspace}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;