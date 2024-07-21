import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { PlusCircle, Settings, Palette } from 'lucide-react';
import WorkspaceList from '../WorkspaceList/WorkspaceList';
import Modal from '../Modal/Modal';
import { useTheme } from '../../contexts/ThemeContext';

const themes = {
    light: {
        background: '#ffffff',
        text: '#333333',
        buttonBg: '#3498db',
        buttonText: '#ffffff',
        buttonHover: '#2980b9',
        footerButtonHover: '#f0f0f0',
        inputBorder: '#ddd',
    },
    dark: {
        background: '#2c2c2c',
        text: '#ffffff',
        buttonBg: '#4a4a4a',
        buttonText: '#ffffff',
        buttonHover: '#5a5a5a',
        footerButtonHover: '#4a4a4a',
        inputBorder: '#555',
    },
    sepia: {
        background: '#e6d9c0',
        text: '#5d4037',
        buttonBg: '#d7cba9',
        buttonText: '#5d4037',
        buttonHover: '#c8b793',
        footerButtonHover: '#e6d9c0',
        inputBorder: '#d0c8b0',
    },
    forest: {
        background: '#c8e6c9',
        text: '#2e7d32',
        buttonBg: '#4caf50',
        buttonText: '#ffffff',
        buttonHover: '#45a049',
        footerButtonHover: '#c8e6c9',
        inputBorder: '#a5d6a7',
    },
};

const SidebarContainer = styled.nav`
  width: 250px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const AddWorkspaceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.2s ease;
  background-color: ${props => props.theme.buttonBg};
  color: ${props => props.theme.buttonText};

  &:hover {
    background-color: ${props => props.theme.buttonHover};
  }

  .icon {
    margin-right: 0.5rem;
  }
`;

const SidebarContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const FooterButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin-top: 0.5rem;
  width: 100%;
  text-align: left;
  transition: background-color 0.2s ease;
  color: ${props => props.theme.text};

  &:hover {
    background-color: ${props => props.theme.footerButtonHover};
  }

  .icon {
    margin-right: 0.5rem;
  }
`;

const ThemeSelector = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  width: 100%;
  margin-left: 0.5rem;

  .icon {
    margin-right: 0.5rem;
  }
`;

const ThemeSelect = styled.select`
  padding: 0.25rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.inputBorder};
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const Sidebar = ({
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    addWorkspace,
    editWorkspace,
    deleteWorkspace
}) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [editingWorkspace, setEditingWorkspace] = useState(null);
    const [error, setError] = useState('');
    const { theme, changeTheme } = useTheme();

    const handleAddWorkspace = () => {
        setIsAddModalOpen(true);
        setError('');
    };

    const handleEditWorkspace = (workspace) => {
        setEditingWorkspace(workspace);
        setNewWorkspaceName(workspace);
        setIsEditModalOpen(true);
        setError('');
    };

    const handleDeleteWorkspace = (workspace) => {
        if (window.confirm(`本当に「${workspace}」を削除しますか？`)) {
            deleteWorkspace(workspace);
        }
    };

    const handleModalClose = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setNewWorkspaceName('');
        setEditingWorkspace(null);
        setError('');
    };

    const handleWorkspaceSubmit = (e) => {
        e.preventDefault();
        const trimmedName = newWorkspaceName.trim();

        if (!trimmedName) {
            setError('ワークスペース名を入力してください。');
            return;
        }

        if (workspaces.includes(trimmedName) && trimmedName !== editingWorkspace) {
            setError('同名のワークスペースが既に存在します。');
            return;
        }

        if (editingWorkspace) {
            editWorkspace(editingWorkspace, trimmedName);
        } else {
            addWorkspace(trimmedName);
        }
        handleModalClose();
    };

    const handleNewWorkspaceNameChange = (e) => {
        setNewWorkspaceName(e.target.value);
        setError('');
    };

    const handleSettingsClick = () => {
        console.log('Settings clicked');
    };

    const handleThemeChange = (e) => {
        changeTheme(e.target.value);
    };

    return (
        <ThemeProvider theme={themes[theme]}>
            <SidebarContainer aria-label="サイドバーナビゲーション">
                <SidebarContent>
                    <AddWorkspaceButton onClick={handleAddWorkspace} aria-label="新しいワークスペースを追加">
                        <PlusCircle size={20} className="icon" aria-hidden="true" />
                        ワークスペースを追加
                    </AddWorkspaceButton>

                    <WorkspaceList
                        workspaces={workspaces}
                        activeWorkspace={activeWorkspace}
                        setActiveWorkspace={setActiveWorkspace}
                        onEdit={handleEditWorkspace}
                        onDelete={handleDeleteWorkspace}
                    />
                </SidebarContent>

                <SidebarFooter>
                    <FooterButton onClick={handleSettingsClick} aria-label="設定">
                        <Settings size={20} className="icon" aria-hidden="true" />
                        設定
                    </FooterButton>
                    <ThemeSelector>
                        <Palette size={20} className="icon" aria-hidden="true" />
                        <ThemeSelect
                            value={theme}
                            onChange={handleThemeChange}
                            aria-label="テーマを選択"
                        >
                            <option value="light">ライトモード</option>
                            <option value="dark">ダークモード</option>
                            <option value="sepia">セピアモード</option>
                            <option value="forest">フォレストモード</option>
                        </ThemeSelect>
                    </ThemeSelector>
                </SidebarFooter>

                <Modal
                    isOpen={isAddModalOpen || isEditModalOpen}
                    onClose={handleModalClose}
                    title={editingWorkspace ? 'ワークスペースを編集' : '新しいワークスペースを追加'}
                >
                    <form onSubmit={handleWorkspaceSubmit} className="modal-form">
                        <div className="form-group">
                            <label htmlFor="workspace-name" className="form-label">ワークスペース名:</label>
                            <input
                                id="workspace-name"
                                type="text"
                                value={newWorkspaceName}
                                onChange={handleNewWorkspaceNameChange}
                                placeholder="ワークスペース名を入力"
                                required
                                className="form-input"
                                aria-invalid={error ? "true" : "false"}
                                aria-describedby="workspace-name-error"
                            />
                            {error && <p id="workspace-name-error" className="error-message" role="alert">{error}</p>}
                        </div>
                        <button type="submit" className="form-submit">{editingWorkspace ? '更新' : '追加'}</button>
                    </form>
                </Modal>
            </SidebarContainer>
        </ThemeProvider>
    );
};

export default Sidebar;