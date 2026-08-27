import axiosInstance from "@/api/axios";

// Products
export const getProducts = async (params) => {
  const response = await axiosInstance.get("/products/", {
    params,
  });

  return response.data;
};

export const createProduct = async (data) => {
  const response = await axiosInstance.post("/products/", data);

  return response.data;
};

export const updateProduct = async ({ id, data }) => {
  const response = await axiosInstance.put(`/products/${id}/`, data);

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/products/${id}/`);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await axiosInstance.get("/categories/");

  return response.data;
};

// Create Category
export const createCategory = async (data) => {
  const response = await axiosInstance.post("/categories/", data);
  return response.data;
};

// Brands
export const getBrands = async () => {
  const response = await axiosInstance.get("/brands/");

  return response.data;
};

// Create brand 
export const createBrand = async (data) => {
  const response = await axiosInstance.post("/brands", data);
  return response.data;
};

// Product Types
export const getProductTypes = async (categoryId) => {
  const response = await axiosInstance.get("/product-types/", {
    params: {
      category: categoryId,
    },
  });
  
  return response.data;
};
// Create Product Type
export const createProductType = async (data) => {
  const response = await axiosInstance.post("/product-types/", data);
  return response.data;
};

// Product Sizes
export const getProductSizes = async (productTypeId) => {
  const response = await axiosInstance.get("/product-sizes/", {
    params: {
      product_type: productTypeId,
    },
  });
  
  return response.data;
}; 

// Create Product size
export const createProductSize = async (data) => {
  const response = await axiosInstance.post("/product-sizes/", data);
  return response.data;
};

// Product Lengths
export const getProductLengths = async (productSizeId) => {
  const response = await axiosInstance.get("/product-lengths/", {
    params: {
      product_size: productSizeId,
    },
  });

  return response.data;
};

// Create Product Length
export const createProductLength = async (data) => {
  const response = await axiosInstance.post("/product-lengths/", data);
  return response.data;
};

export const getAllProducts = async () => {
    const response = await axiosInstance.get("/products/", {
      params: {
        page_size: 1000,
      },
    });
  
    return response.data;
  };