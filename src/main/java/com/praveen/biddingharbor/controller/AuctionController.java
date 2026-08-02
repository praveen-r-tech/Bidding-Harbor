package com.praveen.biddingharbor.controller;

import com.praveen.biddingharbor.dto.auction.AuctionResponse;
import com.praveen.biddingharbor.dto.auction.CreateAuctionRequest;
import com.praveen.biddingharbor.dto.auction.SearchAuctionRequest;
import com.praveen.biddingharbor.dto.auction.UpdateAuctionRequest;
import com.praveen.biddingharbor.service.AuctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;

    @PostMapping
    public AuctionResponse createAuction(
            Authentication authentication,
            @Valid @RequestBody CreateAuctionRequest request) {

        return auctionService.createAuction(
                authentication.getName(),
                request);
    }

    @GetMapping
    public Page<AuctionResponse> getAllAuctions(
            Pageable pageable) {

        return auctionService.getAllOpenAuctions(pageable);
    }

    @GetMapping("/search")
    public Page<AuctionResponse> searchAuctions(

            @ModelAttribute
            SearchAuctionRequest request,

            Pageable pageable) {

        return auctionService.searchAuctions(
                request,
                pageable);
    }

    @GetMapping("/my")
    public List<AuctionResponse> getMyAuctions(
            Authentication authentication) {

        return auctionService.getMyAuctions(
                authentication.getName());
    }

    @GetMapping("/{id}")
    public AuctionResponse getAuction(
            @PathVariable Long id) {

        return auctionService.getAuction(id);
    }

    @PutMapping("/{id}")
    public AuctionResponse updateAuction(

            @PathVariable Long id,

            Authentication authentication,

            @Valid @RequestBody UpdateAuctionRequest request) {

        return auctionService.updateAuction(
                id,
                authentication.getName(),
                request);
    }

    @PutMapping("/{id}/publish")
    public AuctionResponse publishAuction(

            @PathVariable Long id,

            Authentication authentication) {

        return auctionService.publishAuction(
                id,
                authentication.getName());
    }

    @DeleteMapping("/{id}")
    public String deleteAuction(

            @PathVariable Long id,

            Authentication authentication) {

        auctionService.deleteAuction(
                id,
                authentication.getName());

        return "Auction deleted successfully.";
    }
}