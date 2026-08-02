package com.praveen.biddingharbor.controller;

import com.praveen.biddingharbor.dto.auction.AuctionResponse;
import com.praveen.biddingharbor.dto.auction.RejectAuctionRequest;
import com.praveen.biddingharbor.service.AuctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuctionService auctionService;

    @GetMapping("/auctions/pending")
    public List<AuctionResponse> getPendingAuctions() {

        return auctionService.getPendingAuctions();
    }

    @PutMapping("/auctions/{id}/approve")
    public AuctionResponse approveAuction(
            @PathVariable Long id,
            Authentication authentication) {

        return auctionService.approveAuction(
                id,
                authentication.getName());
    }

    @PutMapping("/auctions/{id}/reject")
    public AuctionResponse rejectAuction(
            @PathVariable Long id,
            Authentication authentication,

            @Valid
            @RequestBody
            RejectAuctionRequest request) {

        return auctionService.rejectAuction(
                id,
                authentication.getName(),
                request);
    }
}