package com.praveen.biddingharbor.service;

import com.praveen.biddingharbor.dto.bid.BidResponse;
import com.praveen.biddingharbor.dto.bid.PlaceBidRequest;
import com.praveen.biddingharbor.dto.bid.WinnerResponse;

import java.util.List;

public interface BidService {

    BidResponse placeBid(
            String username,
            PlaceBidRequest request);

    List<BidResponse> getAuctionBids(Long auctionId);

    BidResponse getHighestBid(Long auctionId);

    List<BidResponse> getMyBids(String username);

    WinnerResponse getWinner(Long auctionId);

}