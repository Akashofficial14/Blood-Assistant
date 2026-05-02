import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, getAdminProfileData, updateProfile } from "../../../../api/admin/getProfile";
import { toast } from "react-toastify";
export const getAdminProfile =() => {
    return useQuery({
    queryKey: ["adminProfile"],
    queryFn: getAdminProfileData,
    retry: 0,
  });
} 

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Receives { userId, data } from the component's mutate() call
    mutationFn: ({ userId, data }) => updateProfile({ userId, data }),
    
    onSuccess: (updatedUser) => {
      // 1. Sync LocalStorage with fresh data
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // 2. Optimistically update the cache
      // This forces the UI to update everywhere ['adminProfile'] is used
      queryClient.setQueryData(["adminProfile"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          user: updatedUser, // Assuming your cache structure has a .user property
        };
      });

      // 3. Optional: Invalidate queries to ensure background sync
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });

      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || "Update failed";
      toast.error(errorMsg);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    // Receives { userId, password } from the component
    mutationFn: ({ userId, password }) => changePassword({ userId, password }),
    
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || "Failed to update password";
      toast.error(errorMsg);
    },
  });
};