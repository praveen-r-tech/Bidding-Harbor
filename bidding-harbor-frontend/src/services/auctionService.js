import axiosInstance from "../api/axiosInstance";

export const getAuctions = async () => {

    const response = await axiosInstance.get(
        "/auctions"
    );

    return response.data;
};

export const getAuction = async (id) => {

    const response = await axiosInstance.get(
        `/auctions/${id}`
    );

    return response.data;
};

export const getMyAuctions = async () => {

    const response = await axiosInstance.get(
        "/auctions/my"
    );

    return response.data;
};

export const createAuction = async (auctionData) => {

    const response = await axiosInstance.post(
        "/auctions",
        auctionData
    );

    return response.data;
};

export const updateAuction = async (id, auctionData) => {

    const response = await axiosInstance.put(
        `/auctions/${id}`,
        auctionData
    );

    return response.data;
};

export const publishAuction = async (id) => {

    const response = await axiosInstance.put(
        `/auctions/${id}/publish`
    );

    return response.data;
};

export const deleteAuction = async (id) => {

    const response = await axiosInstance.delete(
        `/auctions/${id}`
    );

    return response.data;
};

export const searchAuctions = async (searchParams) => {
    const response = await axiosInstance.get("/auctions/search", {
        params: searchParams
    });
    return response.data;
};