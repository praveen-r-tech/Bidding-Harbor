package com.praveen.biddingharbor.service.impl;

import com.praveen.biddingharbor.dto.bid.BidResponse;
import com.praveen.biddingharbor.dto.bid.PlaceBidRequest;
import com.praveen.biddingharbor.entity.Auction;
import com.praveen.biddingharbor.entity.Bid;
import com.praveen.biddingharbor.entity.User;
import com.praveen.biddingharbor.entity.enums.AuctionStatus;
import com.praveen.biddingharbor.entity.enums.BidStatus;
import com.praveen.biddingharbor.exception.AuctionNotFoundException;
import com.praveen.biddingharbor.exception.UserNotFoundException;
import com.praveen.biddingharbor.repository.AuctionRepository;
import com.praveen.biddingharbor.repository.BidRepository;
import com.praveen.biddingharbor.repository.UserRepository;
import com.praveen.biddingharbor.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    @Override
    public BidResponse placeBid(
            String username,
            PlaceBidRequest request) {

        User bidder = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        Auction auction = auctionRepository.findById(request.auctionId())
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found."));

        if (auction.getSeller().getId().equals(bidder.getId())) {
            throw new IllegalStateException(
                    "You cannot bid on your own auction.");
        }

        if (auction.getAuctionStatus() != AuctionStatus.LIVE) {
            throw new IllegalStateException(
                    "Auction is not live.");
        }

        if (auction.getEndTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException(
                    "Auction has already ended.");
        }

        BigDecimal minimumBid =
                auction.getCurrentPrice()
                        .add(auction.getMinimumIncrement());

        if (request.bidAmount().compareTo(minimumBid) < 0) {
            throw new IllegalStateException(
                    "Bid must be at least " + minimumBid);
        }

        bidRepository.findTopByAuctionOrderByBidAmountDesc(auction)
                .ifPresent(previousHighest -> {

                    previousHighest.setBidStatus(BidStatus.OUTBID);

                    bidRepository.save(previousHighest);
                });

        Bid bid = Bid.builder()
                .auction(auction)
                .bidder(bidder)
                .bidAmount(request.bidAmount())
                .bidStatus(BidStatus.WINNING)
                .build();

        bidRepository.save(bid);

        auction.setCurrentPrice(request.bidAmount());

        auction.setWinner(bidder);

        auctionRepository.save(auction);

        return mapToResponse(bid);
    }

    @Override
    public List<BidResponse> getAuctionBids(Long auctionId) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found."));

        return bidRepository.findByAuctionOrderByBidTimeDesc(auction)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BidResponse getHighestBid(Long auctionId) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found."));

        Bid bid = bidRepository.findTopByAuctionOrderByBidAmountDesc(auction)
                .orElseThrow(() ->
                        new IllegalStateException("No bids found."));

        return mapToResponse(bid);
    }

    @Override
    public List<BidResponse> getMyBids(String username) {

        User bidder = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        return bidRepository.findByBidder(bidder)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private BidResponse mapToResponse(Bid bid) {

        return new BidResponse(
                bid.getId(),
                bid.getAuction().getId(),
                bid.getBidder().getUsername(),
                bid.getBidAmount(),
                bid.getBidTime(),
                bid.getBidStatus()
        );
    }
}