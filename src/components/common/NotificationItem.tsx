import React from 'react';
import { Notification } from '../../models/types';
import { Bell, MessageSquare, AlertTriangle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../contexts/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead } = useNotifications();
  const { id, type, content, isRead, createdAt } = notification;
  
  // Format the creation date
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Handle click on notification
  const handleClick = () => {
    if (!isRead) {
      markAsRead(id);
    }
  };
  
  // Determine icon based on notification type
  const renderIcon = () => {
    switch (type) {
      case 'Message':
        return <MessageSquare className="h-5 w-5 text-primary-500" />;
      case 'Demand':
        return <Info className="h-5 w-5 text-secondary-500" />;
      case 'Blame':
        return <AlertTriangle className="h-5 w-5 text-error-500" />;
      case 'General':
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div 
      className={`p-4 border-b last:border-b-0 cursor-pointer transition-colors duration-200 ${
        isRead ? 'bg-white hover:bg-gray-50' : 'bg-primary-50 hover:bg-primary-100'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          {renderIcon()}
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-gray-900">
            {content}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {formattedDate}
          </div>
        </div>
        {!isRead && (
          <div className="ml-2 flex-shrink-0">
            <span className="inline-block h-2 w-2 rounded-full bg-primary-500"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;