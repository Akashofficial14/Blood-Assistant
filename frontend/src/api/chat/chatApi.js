import axiosInstance from "../../config/axiosInstance";

export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const res = await axiosInstance.post("/chat", {
      message,
      conversationHistory,
    });

    return res.data;
  } catch (error) {
    throw new Error("Failed to get response");
  }
};
