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
    const token = localStorage.getItem("token");
    const res = await axiosInstance.put(`/auth/update-profile/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Update Profile API Response:", res.data); // Log the full response
    return res.data.data; // This is the updated user object
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
