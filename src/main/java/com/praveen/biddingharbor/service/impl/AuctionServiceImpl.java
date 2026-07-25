package com.praveen.biddingharbor.service.impl;

import com.praveen.biddingharbor.dto.auction.AuctionResponse;
import com.praveen.biddingharbor.dto.auction.CreateAuctionRequest;
import com.praveen.biddingharbor.dto.auction.UpdateAuctionRequest;
import com.praveen.biddingharbor.entity.Auction;
import com.praveen.biddingharbor.entity.User;
import com.praveen.biddingharbor.entity.enums.AuctionStatus;
import com.praveen.biddingharbor.exception.AuctionNotFoundException;
import com.praveen.biddingharbor.exception.UnauthorizedAuctionAccessException;
import com.praveen.biddingharbor.exception.UserNotFoundException;
import com.praveen.biddingharbor.repository.AuctionRepository;
import com.praveen.biddingharbor.repository.UserRepository;
import com.praveen.biddingharbor.service.AuctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionServiceImpl implements AuctionService {

    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    @Override
    public AuctionResponse createAuction(
            String username,
            CreateAuctionRequest request) {

        User seller = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        Auction auction = Auction.builder()
                .title(request.title())
                .description(request.description())
                .startingPrice(request.startingPrice())
                .currentPrice(request.startingPrice())
                .minimumIncrement(request.minimumIncrement())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .seller(seller)
                .build();

        Auction savedAuction = auctionRepository.save(auction);

        return mapToResponse(savedAuction);
    }

    @Override
    public AuctionResponse updateAuction(
            Long auctionId,
            String username,
            UpdateAuctionRequest request) {

        User seller = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found."));

        if (!auction.getSeller().getId().equals(seller.getId())) {
            throw new UnauthorizedAuctionAccessException(
                    "You do not own this auction.");
        }

        if (auction.getAuctionStatus() != AuctionStatus.PENDING_APPROVAL) {
            throw new IllegalStateException(
                    "Only pending auctions can be edited.");
        }

        auction.setTitle(request.title());
        auction.setDescription(request.description());
        auction.setMinimumIncrement(request.minimumIncrement());

        Auction updatedAuction = auctionRepository.save(auction);

        return mapToResponse(updatedAuction);
    }

    @Override
    public void deleteAuction(
            Long auctionId,
            String username) {

        User seller = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found."));

        if (!auction.getSeller().getId().equals(seller.getId())) {
            throw new UnauthorizedAuctionAccessException(
                    "You do not own this auction.");
        }

        auctionRepository.delete(auction);
    }

    @Override
    public AuctionResponse getAuction(Long auctionId) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found."));

        return mapToResponse(auction);
    }

    @Override
    public List<AuctionResponse> getAllOpenAuctions() {

        return auctionRepository.findByAuctionStatus(AuctionStatus.LIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<AuctionResponse> getMyAuctions(String username) {

        User seller = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        return auctionRepository.findBySeller(seller)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AuctionResponse publishAuction(
            Long auctionId,
            String username) {

        User seller = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found."));

        if (!auction.getSeller().getId().equals(seller.getId())) {
            throw new UnauthorizedAuctionAccessException(
                    "You do not own this auction.");
        }

        if (auction.getAuctionStatus() != AuctionStatus.PENDING_APPROVAL) {
            throw new IllegalStateException(
                    "Only pending auctions can be published.");
        }

        auction.setAuctionStatus(AuctionStatus.PENDING_APPROVAL);

        Auction savedAuction = auctionRepository.save(auction);

        return mapToResponse(savedAuction);
    }

    private AuctionResponse mapToResponse(Auction auction) {

        return new AuctionResponse(
                auction.getId(),
                auction.getTitle(),
                auction.getDescription(),
                auction.getStartingPrice(),
                auction.getCurrentPrice(),
                auction.getMinimumIncrement(),
                auction.getStartTime(),
                auction.getEndTime(),
                auction.getAuctionStatus(),
                auction.getSeller().getUsername()
        );
    }
}