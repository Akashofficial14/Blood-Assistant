import axiosInstance from "../../config/axiosInstance";

export const registerBloodBankApi = async (data) => {
  try {
    const res = await axiosInstance.post("/bloodbank/register", data);
    console.log("reg bb res -> ", res);
    return res.data;
  } catch (error) {
    console.log("error in api-> ", error);
  }
};
