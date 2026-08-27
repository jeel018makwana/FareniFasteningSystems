import axiosInstance from "@/api/axios";


export const getInventoryReport = async () => {

    const response = await axiosInstance.get(
        "/reports/inventory/"
    );

    return response.data;
};


export const getSalesReport = async (params) => {

    const response = await axiosInstance.get(
        "/reports/sales/",
        {
            params,
        }
    );

    return response.data;
};


export const getPurchaseReport = async (params) => {

    const response = await axiosInstance.get(
        "/reports/purchases/",
        {
            params,
        }
    );

    return response.data;
};


export const getPaymentReport = async (params) => {

    const response = await axiosInstance.get(
        "/reports/payments/",
        {
            params,
        }
    );

    return response.data;
};


export const getProfitReport = async (params) => {

    const response = await axiosInstance.get(
        "/reports/profit/",
        {
            params,
        }
    );

    return response.data;
};

export const getLowStockReport = async () => {

    const response = await axiosInstance.get(
        "/reports/low-stock/"
    );

    return response.data;

};