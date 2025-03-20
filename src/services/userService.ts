import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { UserProfile } from "@/types/user";

export type { UserProfile };

export const createUserProfile = (userData: {
  email: string;
  name?: string;
  userId?: string;
}) => {
  const createOrUpdateProfile = useMutation(
    api.users.createOrUpdateUserProfile
  );

  return async () => {
    try {
      const id = await createOrUpdateProfile({
        email: userData.email,
        name: userData.name,
        userId: userData.userId || "",
      });

      return id;
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      return null;
    }
  };
};

export const getUserProfile = (email: string) => {
  const profileQuery = useQuery(api.users.getUserProfileByEmail, { email });

  return profileQuery ? mapConvexToUserProfile(profileQuery) : null;
};

export const getUserProfileByClerkId = (userId: string) => {
  const profileQuery = useQuery(api.users.getUserProfileByClerkId, { userId });

  return profileQuery ? mapConvexToUserProfile(profileQuery) : null;
};

export const updateUserProfile = (
  id: string,
  userData: Partial<Omit<UserProfile, "id" | "email" | "role" | "createdAt">>
) => {
  const updateProfile = useMutation(api.users.updateUserProfile);

  return async () => {
    try {
      const updated = await updateProfile({
        id,
        ...userData,
      });

      return mapConvexToUserProfile(updated);
    } catch (error) {
      console.error(`Error in updateUserProfile for ID ${id}:`, error);
      return null;
    }
  };
};

// Helper function to map Convex document to UserProfile interface
const mapConvexToUserProfile = (document: any): UserProfile => {
  if (!document) return null;

  return {
    id: document._id,
    email: document.email,
    role: document.role || "customer",
    name: document.name,
    userId: document.userId,
    phone: document.phone,
    address: document.address,
    createdAt: document.createdAt,
    lastLogin: document.lastLogin,
  };
};
