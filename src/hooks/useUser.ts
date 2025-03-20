
import { useState, useEffect } from 'react';
import { useUser as useClerkUser } from '@clerk/clerk-react';
import { databases, DATABASE_ID, USERS_COLLECTION_ID, ID } from '@/lib/appwrite';

export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useClerkUser();
  const [appwriteUser, setAppwriteUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncUserWithAppwrite = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Check if user exists in Appwrite
        try {
          const existingUsers = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [`clerkId=${user.id}`]
          );

          if (existingUsers.documents.length > 0) {
            // User exists, update if needed
            const appwriteUser = existingUsers.documents[0];
            setAppwriteUser(appwriteUser);
          } else {
            // User doesn't exist, create new profile
            const newUser = await databases.createDocument(
              DATABASE_ID,
              USERS_COLLECTION_ID,
              ID.unique(),
              {
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                createdAt: new Date().toISOString()
              }
            );
            setAppwriteUser(newUser);
          }
        } catch (error) {
          console.error('Error syncing user with Appwrite:', error);
          setError(error);
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in useUser hook:', error);
        setError(error);
        setIsLoading(false);
      }
    };

    syncUserWithAppwrite();
  }, [user, isLoaded, isSignedIn]);

  return {
    user: appwriteUser,
    clerkUser: user,
    isLoading: isLoading || !isLoaded,
    error,
    isSignedIn
  };
};

export default useUser;
