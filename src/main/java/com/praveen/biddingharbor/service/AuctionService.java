package com.praveen.biddingharbor.service;

import com.praveen.biddingharbor.dto.auction.AuctionResponse;
import com.praveen.biddingharbor.dto.auction.CreateAuctionRequest;
import com.praveen.biddingharbor.dto.auction.RejectAuctionRequest;
import com.praveen.biddingharbor.dto.auction.UpdateAuctionRequest;

import java.util.List;

public interface AuctionService {

    AuctionResponse createAuction(
            String username,
            CreateAuctionRequest request);

    AuctionResponse updateAuction(
            Long auctionId,
            String username,
            UpdateAuctionRequest request);

    void deleteAuction(
            Long auctionId,
            String username);

    AuctionResponse getAuction(Long auctionId);

    List<AuctionResponse> getAllOpenAuctions();

    List<AuctionResponse> getMyAuctions(String username);

    AuctionResponse publishAuction(
            Long auctionId,
            String username);

    List<AuctionResponse> getPendingAuctions();

    AuctionResponse approveAuction(
            Long auctionId,
            String adminUsername);

    AuctionResponse rejectAuction(
            Long auctionId,
            String adminUsername,
            RejectAuctionRequest request);
}