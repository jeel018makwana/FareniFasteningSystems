import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPayment } from "../api/paymentsApi";
import { toast } from "react-hot-toast";


export const useCreatePayment = () => {
    
    const queryClient =
        useQueryClient();


    return useMutation({

        mutationFn: createPayment,


        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:["payments"],
            });

            queryClient.invalidateQueries({
                queryKey: ["sales"],
            });

            queryClient.invalidateQueries({
                queryKey: ["purchases"],
            });

            toast.success(
                "Payment created successfully"
            );
        },


        onError: () => {

            toast.error(
                "Failed to create payment"
            );
        },

    });
};