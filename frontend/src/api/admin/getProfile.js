import axiosInstance from "../../config/axiosInstance";

export const getAdminProfileData = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("getAdminProfileData: No token in localStorage");
            throw new Error("No token found");
        }

        const response = await axiosInstance.get("/admin/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Log the full response to see the structure
        console.log("Full API Response Object:", response.data.data.user);

        return response.data.data.user; // Fallback
    } catch (error) {
        // Log details to identify if it's a 401, 404, or Network Error
        console.error("Axios Error Details:", {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data
        });
        throw error;
    }
};

// 1. Update Profile API
export const updateProfile = async ({ userId, data }) => {
try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.put(`/auth/update-profile/${userId}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Update Profile API Response:", res.data); // Log the full response
        return res.data.data; // This is the updated user object
} catch (error) {
    console.log("error in update profile api::", error.message)
}
};

// 2. Change Password API
export const changePassword = async ({ userId, password }) => {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.post(`/auth/update-password/${userId}`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Change Password API Response:", res.data); // Log the full response
    return res.data;
};

export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }

        const response = await axiosInstance.get("/admin/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data.users;
        console.log("All Users API Response:", response.data); // Log the full response
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};

export const updateBulkRoles = async ({ userIds, newRole }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axiosInstance.patch("/admin/change-role",
            { userIds, newRole },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Bulk Role Update API Response:", response.data);
        return response.data.data.updatedUsers;
    }
    catch (error) {
        console.error("Error updating bulk roles:", error);
        throw error;
    }
}

export const verifyBank = async (bankId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axiosInstance.patch(`/admin/verify-bank/${bankId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Bank Verification API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error verifying bank:", error);
        throw error;
    }
}

export const rejectBank = async (bankId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axiosInstance.patch(`/admin/reject-bank/${bankId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Bank Rejection API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error rejecting bank:", error);
        throw error;
    }
}

export const getAllBloodBanks = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Added leading slash to ensure it appends correctly to baseURL
        const response = await axiosInstance.get("/bloodbankowner/getbloodbank", {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Full API Response:", response.data);

        // Based on the JSON you shared earlier: 
        // structure is { data: { bloodBank: { ... } } } or { data: { bloodBanks: [] } }
        // Match the backend key exactly:
        return response.data.data.bloodBanks || response.data.data.bloodBank;
    }
    catch (error) {
        // This will log the actual URL Axios tried to hit
        console.error("URL Attempted:", error.config?.url); 
        throw error;
    }
}

export const getAllVerifiedBloodBanks = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axiosInstance.get("/bloodbankowner/get-verified-bloodbanks", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("All Verified Blood Banks API Response:", response.data);
        return response.data.data.bloodBanks;
    } catch (error) {
        console.error("Error fetching all verified blood banks:", error);
        throw error;
    }
}

export const deleteBloodBank = async (bankId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axiosInstance.delete(`/bloodbankowner/delete-bloodbank/${bankId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Delete Blood Bank API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting blood bank:", error);
        throw error;
    }
}