import axiosInstance from "../../config/axiosInstance";

export const updateInventory = async (data) => {
  try {
     let token = localStorage.getItem("token");
    console.log("Token in getBloodbankDetails API:", token);
    if (!token) {
      throw new Error("No authentication token found");
    }
    const res = await axiosInstance.put("/bloodbank/Inventory", data,{
      headers:({Authorization:`Bearer ${token}`})
    });
    return res.data;
  } catch (error) {
    console.log("error in api-> ", error);
  }
};
