import axiosInstance from "../../config/axiosInstance";

export const getBloodbankDetails = async () => {
  try {
    let token = localStorage.getItem("token");
    console.log("Token in getBloodbankDetails API:", token);
    if (!token) {
      throw new Error("No authentication token found");
    }
    const res = await axiosInstance.get("/bloodbank/details",{
      headers:({Authorization:`Bearer ${token}`})
    });
    return res.data;
  } catch (error) {
    console.log("error in api-> ", error);
  }
};
