import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, Clock, Tag, Link } from 'lucide-react';
import ToggleButtonGroup from '../Buttons/ToggleButtonGroup/ToggleButtonGroup';
import './TaskForm.css';

const TaskForm = ({ onSubmit, initialTask, columnId, parentTasks, colors, initialColor, onColorChange }) => {
    const [task, setTask] = useState(initialTask || {
        title: '',
        content: '',
        deadline: '',
        priority: '',
        reminder: {
            type: 'none',
            customDate: ''
        },
        tags: [],
        parentId: '',
        color: initialColor || colors[0]
    });
    const [selectedColor, setSelectedColor] = useState(task.color);
    const [customColor, setCustomColor] = useState(task.color);

    useEffect(() => {
        if (initialTask) {
            setTask(initialTask);
            setSelectedColor(initialTask.color || colors[0]);
            setCustomColor(initialTask.color || colors[0]);
        }
    }, [initialTask, colors]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prevTask => ({ ...prevTask, [name]: value }));
    };

    const handlePriorityChange = useCallback((newPriority) => {
        setTask(prevTask => ({ ...prevTask, priority: newPriority }));
    }, []);

    const handleReminderChange = (e) => {
        const { value } = e.target;
        setTask(prevTask => ({
            ...prevTask,
            reminder: {
                type: value,
                customDate: value === 'custom' ? prevTask.reminder.customDate : ''
            }
        }));
    };

    const handleCustomReminderChange = (e) => {
        const { value } = e.target;
        setTask(prevTask => ({
            ...prevTask,
            reminder: {
                ...prevTask.reminder,
                customDate: value
            }
        }));
    };

    const handleTagChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setTask(prevTask => ({ ...prevTask, tags }));
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        setCustomColor(color);
        setTask(prevTask => ({ ...prevTask, color }));
        if (onColorChange) {
            onColorChange(task.id, color);
        }
    };

    const handleCustomColorChange = (e) => {
        setCustomColor(e.target.value);
    };

    const handleCustomColorSubmit = () => {
        if (customColor) {
            handleColorChange(customColor);
        }
    };

    const handleParentTaskChange = (e) => {
        const parentId = e.target.value;
        setTask(prevTask => ({ ...prevTask, parentId }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...task, color: selectedColor });
    };

    const priorityOptions = [
        { value: 'low', label: '低' },
        { value: 'medium', label: '中' },
        { value: 'high', label: '高' },
    ];

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    placeholder="タスクのタイトルを入力"
                    required
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <textarea
                    name="content"
                    value={task.content}
                    onChange={handleChange}
                    placeholder="タスクの詳細内容を入力"
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label className="form-label">
                    <Calendar size={16} />
                    期限:
                </label>
                <input
                    type="date"
                    name="deadline"
                    value={task.deadline}
                    onChange={handleChange}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label className="form-label">優先度:</label>
                <ToggleButtonGroup
                    options={priorityOptions}
                    value={task.priority}
                    onChange={handlePriorityChange}
                />
            </div>
            <div className="form-group">
                <label className="form-label">
                    <Clock size={16} />
                    リマインド:
                </label>
                <select
                    name="reminderType"
                    value={task.reminder.type}
                    onChange={handleReminderChange}
                    className="form-input"
                >
                    <option value="none">リマインドなし</option>
                    <option value="1month">1ヶ月前</option>
                    <option value="1week">1週間前</option>
                    <option value="1day">1日前</option>
                    <option value="custom">カスタム</option>
                </select>
                {task.reminder.type === 'custom' && (
                    <input
                        type="datetime-local"
                        value={task.reminder.customDate}
                        onChange={handleCustomReminderChange}
                        className="form-input"
                    />
                )}
            </div>
            <div className="form-group">
                <label className="form-label">
                    <Tag size={16} />
                    タグ:
                </label>
                <input
                    type="text"
                    name="tags"
                    value={task.tags.join(', ')}
                    onChange={handleTagChange}
                    placeholder="カンマ区切りでタグを入力"
                    className="form-input"
                />
            </div>
            {columnId !== 'final' && (
                <div className="form-group">
                    <label className="form-label">
                        <Link size={16} />
                        上位タスク:
                    </label>
                    <select
                        name="parentId"
                        value={task.parentId}
                        onChange={handleParentTaskChange}
                        className="form-input"
                    >
                        <option value="">選択してください</option>
                        {parentTasks.map(parentTask => (
                            <option key={parentTask.id} value={parentTask.id}>
                                {parentTask.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {columnId === 'final' && (
                <div className="form-group">
                    <label className="form-label">色:</label>
                    <div className="color-options">
                        {colors.map(color => (
                            <button
                                key={color}
                                type="button"
                                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange(color)}
                            />
                        ))}
                    </div>
                    <div className="custom-color-input">
                        <input
                            type="color"
                            value={customColor}
                            onChange={handleCustomColorChange}
                        />
                        <button type="button" onClick={handleCustomColorSubmit}>適用</button>
                    </div>
                </div>
            )}
            <button type="submit" className="submit-btn">
                {initialTask ? '更新' : '追加'}
            </button>
        </form>
    );
};

export default TaskForm;