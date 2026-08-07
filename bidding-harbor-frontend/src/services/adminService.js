import axiosInstance from "../api/axiosInstance";

export const getPendingAuctions = async () => {
    const response = await axiosInstance.get("/admin/auctions/pending");
    return response.data;
};

export const approveAuction = async (id) => {
    const response = await axiosInstance.put(`/admin/auctions/${id}/approve`);
    return response.data;
};

export const rejectAuction = async (id, reason) => {
    const response = await axiosInstance.put(`/admin/auctions/${id}/reject`, {
        reason: reason
    });
    return response.data;
};
