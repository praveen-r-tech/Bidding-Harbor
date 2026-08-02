package com.praveen.biddingharbor.service;

import com.praveen.biddingharbor.dto.auction.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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

    List<AuctionResponse> searchAuctions(
            SearchAuctionRequest request);

    Page<AuctionResponse> getAuctions(Pageable pageable);
}