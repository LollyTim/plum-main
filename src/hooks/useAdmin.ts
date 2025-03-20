import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface UseAdminResult {
  isAdmin: boolean;
  isLoading: boolean;
  isLoaded: boolean;
}

const useAdmin = (): UseAdminResult => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const email = user?.primaryEmailAddress?.emailAddress;
  const userProfile = useQuery(
    api.users.getUserProfileByEmail,
    email ? { email } : "skip"
  );

  useEffect(() => {
    if (!isUserLoaded) {
      setIsLoading(false);
      setIsLoaded(true);
      return;
    }

    if (!email) {
      setIsAdmin(false);
      setIsLoading(false);
      setIsLoaded(true);
      return;
    }

    if (userProfile === undefined) {
      setIsLoading(true);
      return;
    }

    setIsAdmin(userProfile?.role === "admin");
    setIsLoading(false);
    setIsLoaded(true);
  }, [user, isUserLoaded, email, userProfile]);

  return { isAdmin, isLoading, isLoaded };
};

export default useAdmin;
