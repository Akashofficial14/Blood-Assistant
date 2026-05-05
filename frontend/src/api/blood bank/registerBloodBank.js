import { toast } from "react-toastify"; // Ensure react-toastify is installed
import axiosInstance from "../../config/axiosInstance";

export const registerBloodBankApi = async (data) => {
  try {
    let token = localStorage.getItem("token");
    console.log("Token in getBloodbankDetails API:", token);
    
    if (!token) {
      toast.error("Session expired. Please login again.");
      throw new Error("No authentication token found");
    }

    const res = await axiosInstance.post("/bloodbank/register", data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    toast.success("Blood Bank registered successfully!");
    console.log("reg bb res -> ", res);
    return res.data;

  } catch (error) {
    console.log("error in api-> ", error);

    // Capture the specific error message from your backend controller
    const errorMessage = error.response?.data?.message || "Something went wrong during registration";

    // Display the error toast (e.g., "This License Number is already registered.")
    toast.error(errorMessage);
    
    // Throw error again so the calling component (like a mutation) knows it failed
    throw error;
  }
};