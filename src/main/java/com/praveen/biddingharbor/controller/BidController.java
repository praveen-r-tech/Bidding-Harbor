package com.praveen.biddingharbor.controller;

import com.praveen.biddingharbor.dto.bid.BidResponse;
import com.praveen.biddingharbor.dto.bid.PlaceBidRequest;
import com.praveen.biddingharbor.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping
    public BidResponse placeBid(
            Authentication authentication,

            @Valid
            @RequestBody
            PlaceBidRequest request) {

        return bidService.placeBid(
                authentication.getName(),
                request);
    }

    @GetMapping("/auction/{auctionId}")
    public List<BidResponse> getAuctionBids(
            @PathVariable Long auctionId) {

        return bidService.getAuctionBids(auctionId);
    }

    @GetMapping("/auction/{auctionId}/highest")
    public BidResponse getHighestBid(
            @PathVariable Long auctionId) {

        return bidService.getHighestBid(auctionId);
    }

    @GetMapping("/my")
    public List<BidResponse> getMyBids(
            Authentication authentication) {

        return bidService.getMyBids(
                authentication.getName());
    }
}