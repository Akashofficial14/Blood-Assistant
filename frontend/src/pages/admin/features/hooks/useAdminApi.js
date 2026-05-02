import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, deleteBloodBank, getAdminProfileData, getAllBloodBanks, getAllUsers, getAllVerifiedBloodBanks, rejectBank, updateBulkRoles, updateProfile, verifyBank } from "../../../../api/admin/getProfile";
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

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });
};

export const useBulkUpdateRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIds, newRole }) => updateBulkRoles({ userIds, newRole }),
    onSuccess: (updatedUsers) => {
      // 1. Manual Cache Update (Instant UI change)
      queryClient.setQueryData(["allUsers"], (oldData) => {
        if (!oldData) return oldData;
        
        // Handle different data structures (array vs object with users key)
        const currentUsers = Array.isArray(oldData) ? oldData : oldData.users;

        const updatedList = currentUsers.map((user) =>
          updatedUsers.find((updated) => updated._id === user._id) || user
        );

        return Array.isArray(oldData) ? updatedList : { ...oldData, users: updatedList };
      });

      // 2. Invalidate Query (Background Refetch)
      // This ensures that if any other data changed (like timestamps or related fields),
      // the UI gets the fresh truth from the DB.
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      
      console.log(`${updatedUsers.length} users refreshed in background.`);
    },
    onError: (error) => {
      console.error("Bulk update failed:", error);
    }
  });
};

export const useVerifyBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bankId) => verifyBank(bankId),
    onSuccess: () => {
      toast.success("Bank verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["allBloodBanks"] }); // Assuming you have a query for all blood banks
      // queryClient.invalidateQueries({ queryKey: ["pendingBanks"] }); // Assuming you have a query for pending banks
    }
  });
};

export const useGetVerifiedBanks = () => {
  return useQuery({
    queryKey: ["verifiedBanks"],
    queryFn: getAllVerifiedBloodBanks,
    retry: 0,
    
  });
}

export const useGetAllBloodBanks = () => {
  return useQuery({
    queryKey: ["allBloodBanks"],
    queryFn: getAllBloodBanks,
    retry: 0,
  });
}

export const useRejectBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bankId) => rejectBank(bankId),
    onSuccess: () => {
      toast.success("Bank rejected successfully!");
      queryClient.invalidateQueries({ queryKey: ["allBloodBanks"] }); // Assuming you have a query for all blood banks
      // queryClient.invalidateQueries({ queryKey: ["pendingBanks"] }); // Assuming you have a query for pending banks
    }
  });
};

export const useDeleteBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bankId) => deleteBloodBank(bankId),
    onSuccess: () => {
      toast.success("Bank deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["allBloodBanks"] });
      queryClient.invalidateQueries({ queryKey: ["verifiedBanks"] });
 // Assuming you have a query for all blood banks
      // queryClient.invalidateQueries({ queryKey: ["pendingBanks"] }); // Assuming you have a query for pending banks
    }
  });
}