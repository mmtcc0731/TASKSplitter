// src/components/WorkspaceList/WorkspaceItem.js
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import './WorkspaceItem.css';

const WorkspaceItem = ({ workspace, isActive, onClick, onEdit, onDelete }) => {
    return (
        <div className={`workspace-item ${isActive ? 'active' : ''}`}>
            <button
                onClick={() => onClick(workspace)}
                className="workspace-button"
                aria-current={isActive ? "page" : undefined}
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
        </div>
    );
};

export default WorkspaceItem;