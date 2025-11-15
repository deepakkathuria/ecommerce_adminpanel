export const API_BASE_URL = "https://hammerhead-app-jkdit.ondigitalocean.app";

export const API_ROUTES = {
  adminProducts: `${API_BASE_URL}/admin/products`,
  adminProduct: (id) => `${API_BASE_URL}/admin/product/${id}`,
  adminCategories: `${API_BASE_URL}/admin/categories`,
};


