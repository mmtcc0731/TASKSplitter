import React, { useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, Copy, Flag, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import './ContextMenu.css';

const ContextMenu = ({ x, y, onClose, options }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const iconMap = {
        '編集': Edit,
        '削除': Trash2,
        'サブタスクを追加': Plus,
        '複製': Copy,
        '優先度を上げる': ArrowUp,
        '優先度を下げる': ArrowDown,
        '期限を設定': Clock,
        'フラグを立てる': Flag,
    };

    return (
        <div
            className="context-menu"
            style={{ top: `${y}px`, left: `${x}px` }}
            ref={menuRef}
        >
            {options.map((option, index) => {
                const Icon = iconMap[option.label] || Edit;
                return (
                    <div
                        key={index}
                        className="context-menu-item"
                        onClick={() => {
                            option.onClick();
                            onClose();
                        }}
                    >
                        <Icon size={16} className="context-menu-icon" />
                        <span>{option.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default ContextMenu;