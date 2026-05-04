import axiosInstance from "../../config/axiosInstance";

export const getRegisteredDonors = async ({bloodBankId}) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axiosInstance.get(`/bloodbank/donor-details/${bloodBankId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Registered Donors API Response:", response.data);
        return response.data.data.donors; // Assuming the API returns donors in this structure
    } catch (error) {
        console.error("Error fetching registered donors:", error);
        throw error;
    }
}