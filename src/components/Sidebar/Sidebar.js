import React, { useState } from 'react';
import { PlusCircle, Settings, Palette } from 'lucide-react';
import WorkspaceList from '../WorkspaceList/WorkspaceList';
import Modal from '../Modal/Modal';
import { useTheme } from '../../contexts/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ workspaces, activeWorkspace, setActiveWorkspace, addWorkspace, editWorkspace, deleteWorkspace }) => {
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
        <nav className="sidebar" aria-label="サイドバーナビゲーション">
            <button
                onClick={handleAddWorkspace}
                className="add-workspace-btn"
                aria-label="新しいワークスペースを追加"
            >
                <PlusCircle size={20} className="icon" aria-hidden="true" />
                ワークスペースを追加
            </button>

            <WorkspaceList
                workspaces={workspaces}
                activeWorkspace={activeWorkspace}
                setActiveWorkspace={setActiveWorkspace}
                onEdit={handleEditWorkspace}
                onDelete={handleDeleteWorkspace}
            />

            <div className="sidebar-footer">
                <button
                    className="footer-btn"
                    onClick={handleSettingsClick}
                    aria-label="設定"
                >
                    <Settings size={20} className="icon" aria-hidden="true" />
                    設定
                </button>
                <div className="theme-selector">
                    <Palette size={20} className="icon" aria-hidden="true" />
                    <select
                        value={theme}
                        onChange={handleThemeChange}
                        aria-label="テーマを選択"
                    >
                        <option value="light">ライトモード</option>
                        <option value="dark">ダークモード</option>
                        <option value="sepia">セピアモード</option>
                        <option value="forest">フォレストモード</option>
                    </select>
                </div>
            </div>

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
        </nav>
    );
};

export default Sidebar;
