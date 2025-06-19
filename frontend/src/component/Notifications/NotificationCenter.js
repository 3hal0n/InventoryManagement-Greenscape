import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './NotificationCenter.css';

function NotificationCenter() {
    const { notifications, clearNotifications } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleNotifications = () => {
        setIsOpen(!isOpen);
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'lowStock':
                return '⚠️';
            default:
                return '📢';
        }
    };

    return (
        <div className="notification-center">
            <button 
                className="notification-toggle"
                onClick={toggleNotifications}
                aria-label="Toggle notifications"
            >
                🔔
                {notifications.length > 0 && (
                    <span className="notification-badge">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {notifications.length > 0 && (
                            <button 
                                onClick={clearNotifications}
                                className="clear-notifications"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <p className="no-notifications">
                                No new notifications
                            </p>
                        ) : (
                            notifications.map((notification, index) => (
                                <div 
                                    key={index} 
                                    className={`notification-item ${notification.type}`}
                                >
                                    <div className="notification-icon">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        {notification.type === 'lowStock' && (
                                            <>
                                                <h4>Low Stock Alert</h4>
                                                <ul>
                                                    {notification.items.map((item, idx) => (
                                                        <li key={idx}>
                                                            {item.itemName}: {item.currentQuantity} units
                                                            (Reorder Level: {item.reorderLevel})
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                        <span className="notification-time">
                                            {formatTimestamp(notification.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationCenter; 