import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllVerifiedBloodBanks } from "../../../../api/admin/getProfile";
// import { sendDonateBloodRegisterRequest } from "../../../../api/user/DonateBloodRegister";
import { sendDonateBloodRegisterRequest } from "../../../../api/user/donateBloodRegister";

import { toast } from "react-toastify";

export const useGetVerifiedBanks = () => {
  return useQuery({
    queryKey: ["verifiedBanks"],
    queryFn: getAllVerifiedBloodBanks,
    retry: 0,
  });
}

export const useDonateBloodRegistration = () => {
  return useMutation({
    mutationKey: ["donateBloodRegistration"],
    // We receive one object and pass it straight to the API function
    mutationFn: (variables) => sendDonateBloodRegisterRequest(variables),
    onSuccess: (data) => {
      toast.success("Donation registered successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  });
};