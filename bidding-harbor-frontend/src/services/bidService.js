import axiosInstance from "../api/axiosInstance";

export const placeBid = async (auctionId, bidAmount) => {

    const response = await axiosInstance.post(
        "/bids",
        {
            auctionId: auctionId,
            bidAmount: bidAmount
        }
    );

    return response.data;
};

export const getAuctionBids = async (auctionId) => {

    const response = await axiosInstance.get(
        `/bids/auction/${auctionId}`
    );

    return response.data;
};

export const getHighestBid = async (auctionId) => {

    const response = await axiosInstance.get(
        `/bids/auction/${auctionId}/highest`
    );

    return response.data;
};

export const getMyBids = async () => {

    const response = await axiosInstance.get(
        "/bids/my"
    );

    return response.data;
};

export const getWinner = async (auctionId) => {

    const response = await axiosInstance.get(
        `/bids/auction/${auctionId}/winner`
    );

    return response.data;
};