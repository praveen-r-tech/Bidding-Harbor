package com.praveen.biddingharbor.service;

import com.praveen.biddingharbor.dto.admin.ApprovalRequest;
import com.praveen.biddingharbor.dto.admin.PendingAuctionResponse;
import com.praveen.biddingharbor.dto.auction.AuctionResponse;

import java.util.List;

public interface AdminService {

    List<PendingAuctionResponse> getPendingAuctions();

    AuctionResponse approveAuction(
            Long auctionId,
            String adminUsername);

    AuctionResponse rejectAuction(
            Long auctionId,
            String adminUsername,
            ApprovalRequest request);

}