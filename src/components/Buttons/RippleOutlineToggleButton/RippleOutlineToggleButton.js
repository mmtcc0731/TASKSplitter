import React from 'react';
import styles from './RippleOutlineToggleButton.module.css';

const RippleOutlineToggleButton = ({
    children,
    className,
    onClick,
    isToggled,
    ...props
}) => {
    return (
        <button
            className={`${styles.rippleOutlineToggle} ${isToggled ? styles.toggled : ''} ${className || ''}`}
            onClick={onClick}
            type="button"
            aria-pressed={isToggled}
            {...props}
        >
            {children}
        </button>
    );
};

export default RippleOutlineToggleButton;