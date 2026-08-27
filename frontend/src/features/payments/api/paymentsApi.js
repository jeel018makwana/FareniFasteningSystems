import axiosInstance from "@/api/axios";

export const getPayments = async (params = {}) => {
  const response = await axiosInstance.get(
    "/payments/",
    { params }
  );

  return response.data;
};

export const createPayment = async (data) => {
  const response = await axiosInstance.post(
    "/payments/",
    data
  );

  return response.data;
};

export const updatePayment = async ({
  id,
  data,
}) => {
  const response = await axiosInstance.put(
    `/payments/${id}/`,
    data
  );

  return response.data;
};

export const deletePayment = async (id) => {
  const response = await axiosInstance.delete(
    `/payments/${id}/`
  );

  return response.data;
};