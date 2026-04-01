import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/services/auth.service";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  isActive: boolean;
  profile?: {
    avatar?: string;
    bio?: string;
  } | null;
}

export function useUser() {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        return await getUserInfo();
      } catch (error) {
        console.error("Error in useUser hook:", error);
        return null;
      }
    },
    // Don't retry on 401/error as it could just mean unauthenticated
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user,
    role: user?.role,
    refetch,
  };
}
