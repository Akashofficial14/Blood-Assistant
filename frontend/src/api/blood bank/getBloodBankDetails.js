import axiosInstance from "../../config/axiosInstance";

export const getBloodbankDetails = async () => {
  try {
    const res = await axiosInstance.get("/bloodbank/details");
    return res.data;
  } catch (error) {
    console.log("error in api-> ", error);
  }
};
