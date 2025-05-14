import { v4 as uuidv4 } from 'uuid';

/**
 * Stores data in localStorage with the given key
 */
export const storeData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing data with key ${key}:`, error);
  }
};

/**
 * Retrieves data from localStorage with the given key
 */
export const retrieveData = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving data with key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Updates an item within a collection in localStorage
 */
export const updateItem = <T extends { id: string }>(
  key: string,
  id: string,
  newData: Partial<T>
): T | null => {
  try {
    const collection = retrieveData<T[]>(key, []);
    const index = collection.findIndex(item => item.id === id);
    
    if (index !== -1) {
      const updatedItem = { ...collection[index], ...newData };
      collection[index] = updatedItem;
      storeData(key, collection);
      return updatedItem;
    }
    return null;
  } catch (error) {
    console.error(`Error updating item with id ${id} in ${key}:`, error);
    return null;
  }
};

/**
 * Adds a new item to a collection in localStorage
 */
export const addItem = <T extends { id?: string }>(key: string, data: T): T => {
  try {
    const collection = retrieveData<T[]>(key, []);
    const newItem = { ...data, id: data.id || uuidv4() };
    collection.push(newItem as T);
    storeData(key, collection);
    return newItem as T;
  } catch (error) {
    console.error(`Error adding item to ${key}:`, error);
    throw error;
  }
};

/**
 * Removes an item from a collection in localStorage
 */
export const removeItem = <T extends { id: string }>(key: string, id: string): boolean => {
  try {
    const collection = retrieveData<T[]>(key, []);
    const filteredCollection = collection.filter(item => item.id !== id);
    
    if (filteredCollection.length !== collection.length) {
      storeData(key, filteredCollection);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error removing item with id ${id} from ${key}:`, error);
    return false;
  }
};

/**
 * Retrieves a single item from a collection in localStorage
 */
export const getItemById = <T extends { id: string }>(
  key: string,
  id: string
): T | null => {
  try {
    const collection = retrieveData<T[]>(key, []);
    return collection.find(item => item.id === id) || null;
  } catch (error) {
    console.error(`Error getting item with id ${id} from ${key}:`, error);
    return null;
  }
};

/**
 * Retrieves items from a collection based on a filter function
 */
export const getItemsByFilter = <T>(
  key: string,
  filterFn: (item: T) => boolean
): T[] => {
  try {
    const collection = retrieveData<T[]>(key, []);
    return collection.filter(filterFn);
  } catch (error) {
    console.error(`Error filtering items from ${key}:`, error);
    return [];
  }
};

/**
 * Clear all data from localStorage
 */
export const clearAllData = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'shoofli_users',
  TECHNICIANS: 'shoofli_technicians',
  CLIENTS: 'shoofli_clients',
  SERVICES: 'shoofli_services',
  PUBLICATIONS: 'shoofli_publications',
  DEMANDS: 'shoofli_demands',
  MESSAGES: 'shoofli_messages',
  NOTIFICATIONS: 'shoofli_notifications',
  COMMENTS: 'shoofli_comments',
  HISTORY: 'shoofli_history',
  RECLAMATIONS: 'shoofli_reclamations',
  AVAILABILITY: 'shoofli_availability',
  CURRENT_USER: 'shoofli_current_user',
  ADMIN_SETTINGS: 'shoofli_admin_settings',
};