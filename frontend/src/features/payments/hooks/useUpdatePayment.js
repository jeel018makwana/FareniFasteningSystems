import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePayment } from "../api/paymentsApi";
import { toast } from "react-hot-toast";


export const useUpdatePayment = () => {

    const queryClient =
        useQueryClient();


    return useMutation({

        mutationFn: updatePayment,


        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:["payments"],
            });
            queryClient.invalidateQueries({
                queryKey:["sales"],
            });
            queryClient.invalidateQueries({
                queryKey:["purchases"],
            });

            toast.success(
                "Payment updated successfully"
            );
        },


        onError: () => {

            toast.error(
                "Failed to update payment"
            );
        },

    });
};