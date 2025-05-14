import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationItem from '../components/common/NotificationItem';
import { Bell } from 'lucide-react';

const Notifications: React.FC = () => {
  const { notifications, markAllAsRead, clearNotifications } = useNotifications();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
            <div className="space-x-4">
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Mark all as read
              </button>
              <button
                onClick={clearNotifications}
                className="text-sm text-gray-500 hover:text-gray-600 font-medium"
              >
                Clear all
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
            
            {notifications.length === 0 && (
              <div className="p-8 text-center">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No notifications
                </h3>
                <p className="mt-1 text-gray-500">
                  You're all caught up! Check back later for new notifications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;