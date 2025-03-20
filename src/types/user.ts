
export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  name?: string;
  userId?: string; // Clerk user ID
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt: string;
  lastLogin: string;
}
