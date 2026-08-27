import axiosInstance from "@/api/axios";

export const getPurchases = async (params) => {
  const response = await axiosInstance.get(
    "/purchases/",
    {
      params,
    }
  );

  return response.data;
};

export const getPurchase = async (id) => {
  const response = await axiosInstance.get(
    `/purchases/${id}/`
  );

  return response.data;
};

export const createPurchase = async (data) => {
  const response = await axiosInstance.post(
    "/purchases/",
    data
  );

  return response.data;
};

export const updatePurchase = async ({
  id,
  data,
}) => {
  const response = await axiosInstance.put(
    `/purchases/${id}/`,
    data
  );

  return response.data;
};

export const deletePurchase = async (id) => {
  const response = await axiosInstance.delete(
    `/purchases/${id}/`
  );

  return response.data;
};
export const downloadPurchaseInvoice = async (purchaseId) => {
  const response = await axiosInstance.get(
    `/purchases/${purchaseId}/invoice/`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};