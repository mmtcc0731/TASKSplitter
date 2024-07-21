// src/components/WorkspaceList/WorkspaceList.js
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import './WorkspaceList.css';

const WorkspaceList = ({ workspaces, activeWorkspace, setActiveWorkspace, onEdit, onDelete }) => {
    return (
        <ul className="workspace-list" role="list">
            {workspaces.map((workspace) => (
                <li key={workspace} className={`workspace-item ${workspace === activeWorkspace ? 'active' : ''}`}>
                    <button
                        onClick={() => setActiveWorkspace(workspace)}
                        className="workspace-button"
                        aria-current={workspace === activeWorkspace ? "page" : undefined}
                    >
                        {workspace}
                    </button>
                    <div className="workspace-actions">
                        <button
                            onClick={() => onEdit(workspace)}
                            className="workspace-action-button"
                            aria-label={`${workspace}を編集`}
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(workspace)}
                            className="workspace-action-button"
                            aria-label={`${workspace}を削除`}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default WorkspaceList;