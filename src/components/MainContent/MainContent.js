import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import TaskCard from '../TaskCard/TaskCard';
import Modal from '../Modal/Modal';
import TaskForm from '../TaskForm/TaskForm';
import ConnectionLines from '../ConnectionLines/ConnectionLines';
import ContextMenu from '../ContextMenu/ContextMenu';
import { scheduleAllReminders } from '../../services/ReminderService';
import './MainContent.css';

const COLOR_SET = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#F1948A", "#82E0AA", "#85C1E9",
    "#F8C471", "#D7BDE2", "#73C6B6", "#F0B27A", "#FAD7A0", "#D2B4DE"
];

const MainContent = ({ activeWorkspace }) => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem(`tasks_${activeWorkspace}`);
        return savedTasks ? JSON.parse(savedTasks) : { final: [], parent: [], child: [], grandchild: [] };
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [activeColumn, setActiveColumn] = useState('');
    const [nextColorIndex, setNextColorIndex] = useState(0);
    const [filteredTasks, setFilteredTasks] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const connectionLinesRef = useRef(null);

    const safeDrawConnections = useCallback(() => {
        if (connectionLinesRef.current && connectionLinesRef.current.drawConnections) {
            connectionLinesRef.current.drawConnections();
        }
    }, []);

    useEffect(() => {
        const savedTasks = localStorage.getItem(`tasks_${activeWorkspace}`);
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            setTasks(parsedTasks);
            scheduleAllReminders(parsedTasks);
        } else {
            setTasks({ final: [], parent: [], child: [], grandchild: [] });
        }
        // タスクの読み込み後に線を描画
        setTimeout(safeDrawConnections, 0);
    }, [activeWorkspace, safeDrawConnections]);

    useEffect(() => {
        localStorage.setItem(`tasks_${activeWorkspace}`, JSON.stringify(tasks));
        scheduleAllReminders(tasks);
    }, [tasks, activeWorkspace]);

    const columns = useMemo(() => [
        { id: 'final', title: '最終タスク' },
        { id: 'parent', title: '親タスク' },
        { id: 'child', title: '子タスク' },
        { id: 'grandchild', title: '孫タスク' }
    ], []);

    const findRelatedFinalTask = useCallback((task) => {
        if (!task) return null;
        if (task.columnId === 'final') return task;
        if (task.columnId === 'parent') {
            return tasks.final.find(ft => ft.id === task.parentId);
        }
        if (task.columnId === 'child') {
            const parentTask = tasks.parent.find(pt => pt.id === task.parentId);
            return parentTask ? findRelatedFinalTask(parentTask) : null;
        }
        if (task.columnId === 'grandchild') {
            const childTask = tasks.child.find(ct => ct.id === task.parentId);
            return childTask ? findRelatedFinalTask(childTask) : null;
        }
        return null;
    }, [tasks]);

    const getTaskColor = useCallback((task) => {
        if (task.columnId === 'final') {
            return task.color;
        } else {
            const relatedFinalTask = findRelatedFinalTask(task);
            return relatedFinalTask ? relatedFinalTask.color : null;
        }
    }, [findRelatedFinalTask]);

    const addNumberingToTasks = useCallback((columnTasks) => {
        const titleCounts = {};
        return columnTasks.map(task => {
            const baseTitle = task.title.replace(/ #\d+$/, '');
            titleCounts[baseTitle] = (titleCounts[baseTitle] || 0) + 1;
            const newTitle = titleCounts[baseTitle] > 1 ? `${baseTitle} #${titleCounts[baseTitle]}` : baseTitle;
            return { ...task, title: newTitle };
        });
    }, []);

    const findRelatedTasks = useCallback((task) => {
        const relatedTasks = new Set([task.id]);
        const addRelatedTasks = (t) => {
            Object.values(tasks).forEach(columnTasks => {
                columnTasks.forEach(ct => {
                    if (ct.parentId === t.id) {
                        relatedTasks.add(ct.id);
                        addRelatedTasks(ct);
                    }
                });
            });
        };
        addRelatedTasks(task);
        return relatedTasks;
    }, [tasks]);

    const handleTaskClick = useCallback((task) => {
        if (filteredTasks && filteredTasks.has(task.id)) {
            setFilteredTasks(null);
        } else {
            setFilteredTasks(findRelatedTasks(task));
        }
    }, [findRelatedTasks, filteredTasks]);

    const handleAddTask = useCallback((columnId) => {
        setActiveColumn(columnId);
        setIsModalOpen(true);
        setEditingTask(null);
    }, []);

    const handleEditTask = (task) => {
        setActiveColumn(task.columnId);
        setIsModalOpen(true);
        setEditingTask(task);
        handleCloseContextMenu();
    };

    const handleDeleteTask = (taskId, columnId) => {
        setTasks(prevTasks => ({
            ...prevTasks,
            [columnId]: prevTasks[columnId].filter(task => task.id !== taskId)
        }));
        handleCloseContextMenu();
    };

    const handleTaskSubmit = useCallback((taskData) => {
        setTasks(prevTasks => {
            let newTasks;
            if (editingTask) {
                newTasks = {
                    ...prevTasks,
                    [activeColumn]: prevTasks[activeColumn].map(task =>
                        task.id === editingTask.id ? { ...task, ...taskData } : task
                    )
                };
            } else {
                const newTask = {
                    id: Date.now().toString(),
                    ...taskData,
                    status: '未着手',
                    columnId: activeColumn,
                    color: activeColumn === 'final' ? COLOR_SET[nextColorIndex] : null,
                };
                newTasks = {
                    ...prevTasks,
                    [activeColumn]: [...prevTasks[activeColumn], newTask]
                };
                if (activeColumn === 'final') {
                    setNextColorIndex((prevIndex) => (prevIndex + 1) % COLOR_SET.length);
                }
            }
            newTasks[activeColumn] = addNumberingToTasks(newTasks[activeColumn]);
            return newTasks;
        });
        setIsModalOpen(false);
        setEditingTask(null);
    }, [editingTask, activeColumn, nextColorIndex, addNumberingToTasks]);

    const getParentTasks = useCallback((columnId) => {
        const parentColumnIndex = columns.findIndex(col => col.id === columnId) - 1;
        return parentColumnIndex >= 0 ? tasks[columns[parentColumnIndex].id] : [];
    }, [columns, tasks]);

    const handleStatusChange = useCallback((taskId, newStatus, columnId) => {
        setTasks(prevTasks => {
            const newTasks = {
                ...prevTasks,
                [columnId]: prevTasks[columnId].map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            };
            return newTasks;
        });
    }, []);

    const handleContextMenu = (event, task) => {
        event.preventDefault();
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            task: task
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleAddSubtask = (parentTask) => {
        const nextColumn = {
            'final': 'parent',
            'parent': 'child',
            'child': 'grandchild'
        }[parentTask.columnId];

        if (nextColumn) {
            setActiveColumn(nextColumn);
            setIsModalOpen(true);
            setEditingTask({ parentId: parentTask.id });
        }
        handleCloseContextMenu();
    };

    const handleDuplicateTask = (task) => {
        const newTask = { ...task, id: Date.now().toString() };
        setTasks(prevTasks => ({
            ...prevTasks,
            [task.columnId]: [...prevTasks[task.columnId], newTask]
        }));
        handleCloseContextMenu();
    };

    const handleDragStart = (e, task, index) => {
        setDraggedTask({ ...task, startIndex: index });
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
        requestAnimationFrame(safeDrawConnections);
    };

    const handleDragOver = (e, overIndex) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (overIndex !== dragOverIndex) {
            setDragOverIndex(overIndex);
            requestAnimationFrame(safeDrawConnections);
        }
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
        setDragOverIndex(null);
        requestAnimationFrame(safeDrawConnections);
    };

    const handleDrop = (e, columnId) => {
        e.preventDefault();
        if (draggedTask && draggedTask.columnId === columnId) {
            const newTasks = [...tasks[columnId]];
            const [removed] = newTasks.splice(draggedTask.startIndex, 1);
            newTasks.splice(dragOverIndex, 0, removed);

            setTasks(prevTasks => ({
                ...prevTasks,
                [columnId]: newTasks
            }));
        }
        handleDragEnd();
        // ドロップ後に線を再描画
        setTimeout(safeDrawConnections, 0);
    };

    const getTaskStyle = (task, index) => {
        if (draggedTask && draggedTask.columnId === task.columnId) {
            if (draggedTask.id === task.id) {
                return { opacity: 0.5 };
            }
            if (dragOverIndex !== null) {
                if (draggedTask.startIndex < dragOverIndex) {
                    if (index > draggedTask.startIndex && index <= dragOverIndex) {
                        return { transform: 'translateY(-100%)' };
                    }
                } else {
                    if (index < draggedTask.startIndex && index >= dragOverIndex) {
                        return { transform: 'translateY(100%)' };
                    }
                }
            }
        }
        return {};
    };

    return (
        <div className="main-content">
            <h1 className="workspace-title">{activeWorkspace}</h1>
            <div className="columns-container">
                {columns.map(column => (
                    <div
                        key={column.id}
                        className="column"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        <h2 className="column-title">{column.title}</h2>
                        <div className="task-list">
                            {(tasks[column.id] || []).map((task, index) => (
                                <div
                                    key={task.id}
                                    id={`task-${task.id}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onContextMenu={(e) => handleContextMenu(e, task)}
                                    style={getTaskStyle(task, index)}
                                >
                                    <TaskCard
                                        task={task}
                                        onEdit={() => handleEditTask(task)}
                                        onDelete={() => handleDeleteTask(task.id, column.id)}
                                        onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus, column.id)}
                                        color={getTaskColor(task)}
                                        isFiltered={filteredTasks ? filteredTasks.has(task.id) : true}
                                        onClick={() => handleTaskClick(task)}
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="add-task-btn" onClick={() => handleAddTask(column.id)}>
                            + タスクを追加
                        </button>
                    </div>
                ))}
            </div>
            <ConnectionLines
                tasks={tasks}
                getTaskColor={getTaskColor}
                ref={connectionLinesRef}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTask ? 'タスクを編集' : 'タスクを追加'}
            >
                <TaskForm
                    onSubmit={handleTaskSubmit}
                    initialTask={editingTask}
                    columnId={activeColumn}
                    parentTasks={getParentTasks(activeColumn)}
                    colors={COLOR_SET}
                    finalTasks={tasks.final}
                />
            </Modal>
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={handleCloseContextMenu}
                    options={[
                        { label: '編集', onClick: () => handleEditTask(contextMenu.task) },
                        { label: '削除', onClick: () => handleDeleteTask(contextMenu.task.id, contextMenu.task.columnId) },
                        { label: 'サブタスクを追加', onClick: () => handleAddSubtask(contextMenu.task) },
                        { label: '複製', onClick: () => handleDuplicateTask(contextMenu.task) }
                    ]}
                />
            )}
        </div>
    );
};

export default MainContent;