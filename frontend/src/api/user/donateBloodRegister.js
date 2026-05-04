import axiosInstance from "../../config/axiosInstance";

// Correct destructuring in the function arguments
export const sendDonateBloodRegisterRequest = async ({ bloodBankId, donorData }) => {
  try {
    let token = localStorage.getItem("token");
    
    // The URL should use the bloodBankId string
    const res = await axiosInstance.post(`/user/donate/register/${bloodBankId}`, donorData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return res.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};