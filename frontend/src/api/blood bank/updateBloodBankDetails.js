import axiosInstance from "../../config/axiosInstance";

export const updateBloodBankDetails = async (data) => {
  try {
    const res = await axiosInstance.put("/bloodbank/update/details", data);
    return res.data;
  } catch (error) {
    console.log("error in api-> ", error);
  }
};
