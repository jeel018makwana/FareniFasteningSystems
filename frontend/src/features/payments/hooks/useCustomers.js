import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axios";


const getCustomers = async () => {

    const response =
        await axiosInstance.get(
            "/customers/"
        );

    return response.data;

};


export const useCustomers = () => {

    return useQuery({

        queryKey:["customers"],

        queryFn:getCustomers,

    });

};