import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  position: relative;
  width: ${({ $isOpen }) => ($isOpen ? '280px' : '0')};
  transition: width 0.3s ease;
  flex-shrink: 0;
`;

const SidebarContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  overflow-y: auto;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  display: flex;
  flex-direction: column;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  right: ${({ $isOpen }) => ($isOpen ? '-20px' : '-16px')};
  background-color: rgba(240, 240, 240, 0.7);
  border: none;
  border-radius: ${({ $isOpen }) => ($isOpen ? '0 4px 4px 0' : '4px')};
  padding: 8px 2px;
  cursor: pointer;
  z-index: 1000;
  transition: right 0.3s ease, background-color 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background-color: rgba(224, 224, 224, 0.9);
  }
`;

const ToggleSidebar = ({ children, onToggle }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        if (onToggle) {
            onToggle(!isOpen);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768 && isOpen) {
                setIsOpen(false);
                if (onToggle) {
                    onToggle(false);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, onToggle]);

    return (
        <SidebarContainer $isOpen={isOpen}>
            <SidebarContent $isOpen={isOpen}>{children}</SidebarContent>
            <ToggleButton onClick={toggleSidebar} $isOpen={isOpen}>
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </ToggleButton>
        </SidebarContainer>
    );
};

export default ToggleSidebar;