import React from 'react';
import RippleOutlineToggleButton from '../RippleOutlineToggleButton/RippleOutlineToggleButton';
import './ToggleButtonGroup.css';

const ToggleButtonGroup = ({ options, value, onChange }) => {
    return (
        <div className="toggle-button-group">
            {options.map((option) => (
                <RippleOutlineToggleButton
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    isToggled={value === option.value}
                >
                    {option.label}
                </RippleOutlineToggleButton>
            ))}
        </div>
    );
};

export default ToggleButtonGroup;