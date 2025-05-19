import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, NotificationType } from '../models/types';
import { v4 as uuidv4 } from 'uuid';
import { retrieveData, storeData, updateItem, STORAGE_KEYS } from '../services/storageService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    content: string,
    type: NotificationType,
    userId?: string
  ) => Notification;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    if (user) {
      const allNotifications = retrieveData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
      const userNotifications = allNotifications.filter(
        notification => notification.userId === user.id
      );
      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  }, [user]);
  
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  const addNotification = (
    content: string,
    type: NotificationType,
    userId?: string
  ): Notification => {
    const targetUserId = userId || (user ? user.id : '');
    
    if (!targetUserId) {
      throw new Error('Cannot add notification: No target user specified');
    }
    
    const newNotification: Notification = {
      id: uuidv4(),
      userId: targetUserId,
      content,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    
    // Update state only if it's for the current user
    if (user && targetUserId === user.id) {
      setNotifications(prev => [newNotification, ...prev]);
    }
    
    // Update localStorage
    const allNotifications = retrieveData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    allNotifications.push(newNotification);
    storeData(STORAGE_KEYS.NOTIFICATIONS, allNotifications);
    
    return newNotification;
  };
  
  const markAsRead = (id: string) => {
    if (!user) return;
    
    // Update state
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    // Update localStorage
    const allNotifications = retrieveData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const updatedNotifications = allNotifications.map(notification =>
      notification.id === id && notification.userId === user.id
        ? { ...notification, isRead: true }
        : notification
    );
    storeData(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
  };
  
  const markAllAsRead = () => {
    if (!user) return;
    
    // Update state
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    // Update localStorage
    const allNotifications = retrieveData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const updatedNotifications = allNotifications.map(notification =>
      notification.userId === user.id
        ? { ...notification, isRead: true }
        : notification
    );
    storeData(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
  };
  
  const clearNotifications = () => {
    if (!user) return;
    
    // Update state
    setNotifications([]);
    
    // Update localStorage
    const allNotifications = retrieveData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const updatedNotifications = allNotifications.filter(
      notification => notification.userId !== user.id
    );
    storeData(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};