// User-related types
export type UserRole = 'Client' | 'Technician' | 'Administrator';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  region: string;
  role: UserRole;
  createdAt: string;
  isApproved: boolean;
}

export interface Technician extends User {
  specialty: string;
  rating: number;
  bio: string;
  pricePerService: number;
  availability: Availability[];
}

export interface Client extends User {
  // Client-specific properties could be added here
}

// Service-related types
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  technicianId: string;
  createdAt: string;
}

// Publication-related types
export interface Publication {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  clientId: string;
}

// Demand-related types
export type DemandStatus = 'Pending' | 'Accepted' | 'Completed' | 'Rejected';

export interface Demand {
  id: string;
  description: string;
  clientId: string;
  technicianId: string;
  status: DemandStatus;
  createdAt: string;
}

// Availability-related types
export interface Availability {
  id: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

// Message-related types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

// Notification-related types
export type NotificationType = 'Message' | 'Demand' | 'Blame' | 'General';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// Comment-related types
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  targetId: string; // Could be a publicationId or technicianId
  targetType: 'Publication' | 'Technician';
  createdAt: string;
}

// History-related types
export type ActionType = 'Sent Message' | 'Posted Publication' | 'Requested Service' | 'Completed Service';

export interface History {
  id: string;
  userId: string;
  actionType: ActionType;
  description: string;
  date: string;
}

// Reclamation-related types
export interface Reclamation {
  id: string;
  authorId: string;
  description: string;
  targetUserId: string;
  createdAt: string;
  status: 'Pending' | 'Resolved' | 'Rejected';
}

// Auth-related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  region: string;
  role: UserRole;
  specialty?: string;
  bio?: string;
  pricePerService?: number;
}