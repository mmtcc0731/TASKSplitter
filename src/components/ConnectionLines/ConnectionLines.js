import React, { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle } from 'react';

const ConnectionLines = forwardRef(({ tasks, getTaskColor }, ref) => {
    const canvasRef = useRef(null);
    const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
    const drawTimeoutRef = useRef(null);

    const drawConnections = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const drawLine = (startElement, endElement, color) => {
            if (!startElement || !endElement) return;

            const startRect = startElement.getBoundingClientRect();
            const endRect = endElement.getBoundingClientRect();

            const startX = startRect.right - rect.left - scrollOffset.x;
            const startY = startRect.top + startRect.height / 2 - rect.top - scrollOffset.y;
            const endX = endRect.left - rect.left - scrollOffset.x;
            const endY = endRect.top + endRect.height / 2 - rect.top - scrollOffset.y;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.stroke();

            const drawCircle = (x, y) => {
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
                ctx.fillStyle = 'white';
                ctx.fill();
            };

            drawCircle(startX, startY);
            drawCircle(endX, endY);
        };

        const drawColumnConnections = (columnTasks, nextColumnTasks) => {
            columnTasks.forEach(task => {
                const startElement = document.getElementById(`task-${task.id}`);
                nextColumnTasks.forEach(nextTask => {
                    if (nextTask.parentId === task.id) {
                        const endElement = document.getElementById(`task-${nextTask.id}`);
                        const color = getTaskColor(nextTask);
                        if (color) {
                            drawLine(startElement, endElement, color);
                        }
                    }
                });
            });
        };

        drawColumnConnections(tasks.final, tasks.parent);
        drawColumnConnections(tasks.parent, tasks.child);
        drawColumnConnections(tasks.child, tasks.grandchild);

    }, [tasks, getTaskColor, scrollOffset]);

    const scheduleDrawConnections = useCallback(() => {
        if (drawTimeoutRef.current) {
            clearTimeout(drawTimeoutRef.current);
        }
        drawTimeoutRef.current = setTimeout(() => {
            requestAnimationFrame(drawConnections);
        }, 0);
    }, [drawConnections]);

    useImperativeHandle(ref, () => ({
        drawConnections: scheduleDrawConnections
    }));

    useEffect(() => {
        let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let lastScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            const deltaY = scrollTop - lastScrollTop;
            const deltaX = scrollLeft - lastScrollLeft;

            setScrollOffset(prevOffset => ({
                x: prevOffset.x + deltaX,
                y: prevOffset.y + deltaY
            }));

            lastScrollTop = scrollTop;
            lastScrollLeft = scrollLeft;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setScrollOffset({ x: 0, y: 0 });
            scheduleDrawConnections();
        };

        const handleTransitionEnd = (e) => {
            if (e.target.classList.contains('task-card')) {
                scheduleDrawConnections();
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('transitionend', handleTransitionEnd);

        // 初期描画のための複数回の呼び出し
        scheduleDrawConnections();
        setTimeout(scheduleDrawConnections, 100);
        setTimeout(scheduleDrawConnections, 500);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('transitionend', handleTransitionEnd);
        };
    }, [scheduleDrawConnections]);

    useEffect(() => {
        scheduleDrawConnections();
    }, [tasks, scheduleDrawConnections]);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }} />;
});

export default ConnectionLines;