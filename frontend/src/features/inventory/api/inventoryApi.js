import axiosInstance  from "@/api/axios";
export const getInventory = async (params) => {
    const response = await axiosInstance.get(
        "/inventory/",
        {params,}
    );
    return response.data;
};

export const createInventory = async (data) => {
    const response = await axiosInstance.post(
        "/inventory/",
        data
    );
    return response.data;
};

export const updateInventory = async ({
    id,
    data,
}) => {
    const response = await axiosInstance.put(
        `/inventory/${id}/`,
        data
    );
    return response.data;
};

export const deleteInventory = async (id) => {
    const response = await axiosInstance.delete(
        `/inventory/${id}/`
    );

    return response.data;
};
