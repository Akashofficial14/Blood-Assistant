import axiosInstance from "../../config/axiosInstance";

export const updateInventory = async (data) => {
  try {
    const res = await axiosInstance.put("/bloodbank/Inventory", data);
    return res.data;
  } catch (error) {
    console.log("error in api-> ", error);
  }
};
