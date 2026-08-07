import axiosInstance from "../api/axiosInstance";

export const getUserDashboard = async () => {
    const response = await axiosInstance.get("/dashboard/user");
    return response.data;
};

export const getSellerDashboard = async () => {
    const response = await axiosInstance.get("/dashboard/seller");
    return response.data;
};

export const getAdminDashboard = async () => {
    const response = await axiosInstance.get("/dashboard/admin");
    return response.data;
};
