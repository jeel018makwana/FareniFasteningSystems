import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductType } from "../api/productApi";

export const useCreateProductType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProductType,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["product-types"],
            });
        },
    });
};