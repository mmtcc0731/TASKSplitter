// src/services/ReminderService.js

export const scheduleReminder = (task) => {
    if (task.reminder && task.reminder.type !== 'none') {
        let reminderTime;

        switch (task.reminder.type) {
            case '1month':
                reminderTime = new Date(task.deadline);
                reminderTime.setMonth(reminderTime.getMonth() - 1);
                break;
            case '1week':
                reminderTime = new Date(task.deadline);
                reminderTime.setDate(reminderTime.getDate() - 7);
                break;
            case '1day':
                reminderTime = new Date(task.deadline);
                reminderTime.setDate(reminderTime.getDate() - 1);
                break;
            case 'custom':
                reminderTime = new Date(task.reminder.customDate);
                break;
            default:
                return;
        }

        const now = new Date();
        const timeUntilReminder = reminderTime.getTime() - now.getTime();

        if (timeUntilReminder > 0) {
            setTimeout(() => {
                showNotification(task);
            }, timeUntilReminder);
        }
    }
};

const showNotification = (task) => {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('タスクリマインダー', {
                    body: `"${task.title}" の期限が近づいています。`,
                    icon: '../../../frontend/public/favicon.ico'  // アプリのアイコンのパスを指定してください
                });
            }
        });
    }
};

export const scheduleAllReminders = (tasks) => {
    Object.values(tasks).flat().forEach(scheduleReminder);
};