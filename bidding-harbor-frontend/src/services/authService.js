import axiosInstance from "../api/axiosInstance";

export const register = async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data; // returns { token }
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/users/me");
    return response.data; // returns UserResponse
};

export const updateProfile = async (profileData) => {
    const response = await axiosInstance.put("/users/me", profileData);
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await axiosInstance.put("/users/change-password", passwordData);
    return response.data;
};

export const deleteAccount = async () => {
    const response = await axiosInstance.delete("/users/me");
    return response.data;
};
