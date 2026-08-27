import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePayment } from "../api/paymentsApi";
import { toast } from "react-hot-toast";


export const useDeletePayment = () => {

    const queryClient =
        useQueryClient();


    return useMutation({

        mutationFn: deletePayment,


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
                "Payment deleted successfully"
            );
        },


        onError: () => {

            toast.error(
                "Failed to delete payment"
            );
        },

    });
};