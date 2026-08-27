import axiosInstance from "@/api/axios";

export const getSales = async (params) => {
  const response = await axiosInstance.get(
    "/sales/",
    {
      params,
    }
  );

  return response.data;
};

export const getSale = async (id) => {
  const response = await axiosInstance.get(
    `/sales/${id}/`
  );

  return response.data;
};

export const createSale = async (data) => {
  const response = await axiosInstance.post(
    "/sales/",
    data
  );

  return response.data;
};

export const updateSale = async ({
  id,
  data,
}) => {
  const response = await axiosInstance.put(
    `/sales/${id}/`,
    data
  );

  return response.data;
};

export const deleteSale = async (id) => {
  const response = await axiosInstance.delete(
    `/sales/${id}/`
  );

  return response.data;
};

export const downloadInvoice = async (id) => {
  const response = await axiosInstance.get(
    `/sales/${id}/invoice/`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};