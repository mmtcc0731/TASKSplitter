import React from 'react';
import { Edit2, Trash2, Calendar, Flag, Check, Clock, AlertCircle } from 'lucide-react';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, color, isFiltered, onClick }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'red';
            case 'medium':
                return 'orange';
            case 'low':
                return 'green';
            default:
                return 'gray';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case '完了':
                return <Check size={14} className="status-icon completed" />;
            case '進行中':
                return <Clock size={14} className="status-icon in-progress" />;
            case '未着手':
                return <AlertCircle size={14} className="status-icon not-started" />;
            default:
                return null;
        }
    };

    const statusOptions = ['未着手', '進行中', '完了'];

    return (
        <div
            className={`task-card ${isFiltered ? '' : 'filtered-out'}`}
            style={{ borderColor: color }}
            id={`task-${task.id}`}
            onClick={() => onClick(task)}
        >
            <div className="task-content">
                <h3 className="task-title">
                    {getStatusIcon(task.status)}
                    <span className="title-text">{task.title}</span>
                </h3>
                <div className="task-details">
                    {task.deadline && (
                        <div className="task-deadline">
                            <Calendar size={14} />
                            <span>{new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                    )}
                    <div className="task-priority" style={{ color: getPriorityColor(task.priority) }}>
                        <Flag size={14} />
                        <span>{task.priority}</span>
                    </div>
                    <div className="task-status">
                        <select
                            value={task.status}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className={`status-select ${task.status}`}
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="task-actions">
                <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="task-action-btn" aria-label="タスクを編集">
                    <Edit2 size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="task-action-btn" aria-label="タスクを削除">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
