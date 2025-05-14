import { User, LoginCredentials, RegisterFormData, UserRole } from '../models/types';
import { v4 as uuidv4 } from 'uuid';
import { storeData, retrieveData, getItemsByFilter, STORAGE_KEYS } from './storageService';

// Simple hash function (for demonstration purposes only)
// In a real application, use a proper hashing library with salt
const hashPassword = (password: string): string => {
  // This is NOT secure, just for demo purposes
  return btoa(password + 'shoofli-salt');
};

/**
 * Authenticates a user with email and password
 */
export const login = (credentials: LoginCredentials): User | null => {
  try {
    const { email, password } = credentials;
    const users = retrieveData<User[]>(STORAGE_KEYS.USERS, []);
    
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.passwordHash === hashPassword(password)
    );
    
    if (user) {
      // Only allow approved users or administrators to log in
      if (!user.isApproved && user.role !== 'Administrator') {
        throw new Error('Your account is pending approval by an administrator');
      }
      
      // Store current user in localStorage
      storeData(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Registers a new user
 */
export const register = (formData: RegisterFormData): User => {
  try {
    const { email, password, firstName, lastName, phoneNumber, region, role } = formData;
    
    // Check if user with that email already exists
    const users = retrieveData<User[]>(STORAGE_KEYS.USERS, []);
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      throw new Error('User with that email already exists');
    }
    
    // Create new user
    const userId = uuidv4();
    const now = new Date().toISOString();
    
    // Administrators are approved by default, others need approval
    const isApproved = role === 'Administrator' ? true : false;
    
    const newUser: User = {
      id: userId,
      email,
      passwordHash: hashPassword(password),
      firstName,
      lastName,
      phoneNumber,
      region,
      role,
      createdAt: now,
      isApproved
    };
    
    // Save user to localStorage
    users.push(newUser);
    storeData(STORAGE_KEYS.USERS, users);
    
    // If the role is Technician, save additional fields
    if (role === 'Technician' && formData.specialty && formData.bio) {
      const technicians = retrieveData<User[]>(STORAGE_KEYS.TECHNICIANS, []);
      const newTechnician = {
        ...newUser,
        specialty: formData.specialty,
        bio: formData.bio,
        pricePerService: formData.pricePerService || 0,
        rating: 0,
        availability: []
      };
      
      technicians.push(newTechnician);
      storeData(STORAGE_KEYS.TECHNICIANS, technicians);
    }
    
    // If the role is Client, save to clients collection
    if (role === 'Client') {
      const clients = retrieveData<User[]>(STORAGE_KEYS.CLIENTS, []);
      clients.push(newUser);
      storeData(STORAGE_KEYS.CLIENTS, clients);
    }
    
    // If this is the first user, make them an administrator
    if (users.length === 1) {
      users[0].role = 'Administrator';
      users[0].isApproved = true;
      storeData(STORAGE_KEYS.USERS, users);
      storeData(STORAGE_KEYS.CURRENT_USER, users[0]);
      return users[0];
    }
    
    // Don't log in newly registered users automatically, they need to be approved
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Checks if a user is logged in
 */
export const getCurrentUser = (): User | null => {
  return retrieveData<User | null>(STORAGE_KEYS.CURRENT_USER, null);
};

/**
 * Updates the current user's information
 */
export const updateCurrentUser = (userData: Partial<User>): User | null => {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }
    
    // Update user in the users collection
    const users = retrieveData<User[]>(STORAGE_KEYS.USERS, []);
    const index = users.findIndex(u => u.id === currentUser.id);
    
    if (index !== -1) {
      const updatedUser = { ...users[index], ...userData };
      users[index] = updatedUser;
      storeData(STORAGE_KEYS.USERS, users);
      
      // Update in the appropriate role collection as well
      if (updatedUser.role === 'Technician') {
        const technicians = retrieveData<User[]>(STORAGE_KEYS.TECHNICIANS, []);
        const techIndex = technicians.findIndex(t => t.id === currentUser.id);
        
        if (techIndex !== -1) {
          technicians[techIndex] = { ...technicians[techIndex], ...userData };
          storeData(STORAGE_KEYS.TECHNICIANS, technicians);
        }
      } else if (updatedUser.role === 'Client') {
        const clients = retrieveData<User[]>(STORAGE_KEYS.CLIENTS, []);
        const clientIndex = clients.findIndex(c => c.id === currentUser.id);
        
        if (clientIndex !== -1) {
          clients[clientIndex] = { ...clients[clientIndex], ...userData };
          storeData(STORAGE_KEYS.CLIENTS, clients);
        }
      }
      
      // Update current user in localStorage
      storeData(STORAGE_KEYS.CURRENT_USER, updatedUser);
      return updatedUser;
    }
    
    return null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Logs out the current user
 */
export const logout = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Approves a user account (admin only)
 */
export const approveUser = (userId: string): User | null => {
  try {
    const users = retrieveData<User[]>(STORAGE_KEYS.USERS, []);
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
      users[index].isApproved = true;
      storeData(STORAGE_KEYS.USERS, users);
      
      // Update in the appropriate role collection as well
      if (users[index].role === 'Technician') {
        const technicians = retrieveData<User[]>(STORAGE_KEYS.TECHNICIANS, []);
        const techIndex = technicians.findIndex(t => t.id === userId);
        
        if (techIndex !== -1) {
          technicians[techIndex].isApproved = true;
          storeData(STORAGE_KEYS.TECHNICIANS, technicians);
        }
      } else if (users[index].role === 'Client') {
        const clients = retrieveData<User[]>(STORAGE_KEYS.CLIENTS, []);
        const clientIndex = clients.findIndex(c => c.id === userId);
        
        if (clientIndex !== -1) {
          clients[clientIndex].isApproved = true;
          storeData(STORAGE_KEYS.CLIENTS, clients);
        }
      }
      
      return users[index];
    }
    
    return null;
  } catch (error) {
    console.error('Error approving user:', error);
    throw error;
  }
};

/**
 * Rejects/deletes a user account (admin only)
 */
export const deleteUser = (userId: string): boolean => {
  try {
    const users = retrieveData<User[]>(STORAGE_KEYS.USERS, []);
    const updatedUsers = users.filter(u => u.id !== userId);
    
    if (updatedUsers.length !== users.length) {
      storeData(STORAGE_KEYS.USERS, updatedUsers);
      
      // Also remove from role-specific collections
      const technicians = retrieveData<User[]>(STORAGE_KEYS.TECHNICIANS, []);
      const clients = retrieveData<User[]>(STORAGE_KEYS.CLIENTS, []);
      
      storeData(STORAGE_KEYS.TECHNICIANS, technicians.filter(t => t.id !== userId));
      storeData(STORAGE_KEYS.CLIENTS, clients.filter(c => c.id !== userId));
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Gets all pending users for admin approval
 */
export const getPendingUsers = (): User[] => {
  try {
    const users = retrieveData<User[]>(STORAGE_KEYS.USERS, []);
    return users.filter(u => !u.isApproved && u.role !== 'Administrator');
  } catch (error) {
    console.error('Error getting pending users:', error);
    throw error;
  }
};

/**
 * Initializes the application with a default admin if no users exist
 */
export const initializeAuthSystem = (): void => {
  try {
    const users = retrieveData<User[]>(STORAGE_KEYS.USERS, []);
    
    // If no users exist, create a default admin
    if (users.length === 0) {
      const adminId = uuidv4();
      const now = new Date().toISOString();
      
      const admin: User = {
        id: adminId,
        email: 'admin@shoofli.com',
        passwordHash: hashPassword('admin123'),
        firstName: 'System',
        lastName: 'Administrator',
        phoneNumber: '1234567890',
        region: 'System',
        role: 'Administrator',
        createdAt: now,
        isApproved: true
      };
      
      users.push(admin);
      storeData(STORAGE_KEYS.USERS, users);
      console.log('Created default admin user: admin@shoofli.com / admin123');
    }
  } catch (error) {
    console.error('Error initializing auth system:', error);
  }
};