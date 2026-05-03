import axiosInstance from "../../config/axiosInstance";

export const getDashboardData = async (data) => {
  try {
    const res = await axiosInstance.get("/bloodbank/inventory");
    return res.data;
  } catch (error) {
    console.log("error in api-> ", error);
  }
};
