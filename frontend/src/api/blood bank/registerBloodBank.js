import axiosInstance from "../../config/axiosInstance";

export const registerBloodBankApi = async (data) => {
  try {
     let token = localStorage.getItem("token");
    console.log("Token in getBloodbankDetails API:", token);
    if (!token) {
      throw new Error("No authentication token found");
    }
    const res = await axiosInstance.post("/bloodbank/register", data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("reg bb res -> ", res);
    return res.data;
  } catch (error) {
    console.log("error in api-> ", error);
  }
};
