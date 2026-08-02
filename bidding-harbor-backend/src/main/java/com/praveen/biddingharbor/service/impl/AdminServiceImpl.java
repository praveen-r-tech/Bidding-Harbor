package com.praveen.biddingharbor.service.impl;

import com.praveen.biddingharbor.dto.admin.ApprovalRequest;
import com.praveen.biddingharbor.dto.admin.PendingAuctionResponse;
import com.praveen.biddingharbor.dto.auction.AuctionResponse;
import com.praveen.biddingharbor.entity.Auction;
import com.praveen.biddingharbor.entity.User;
import com.praveen.biddingharbor.entity.enums.AuctionStatus;
import com.praveen.biddingharbor.exception.AuctionAlreadyReviewedException;
import com.praveen.biddingharbor.exception.AuctionNotFoundException;
import com.praveen.biddingharbor.exception.UserNotFoundException;
import com.praveen.biddingharbor.repository.AuctionRepository;
import com.praveen.biddingharbor.repository.UserRepository;
import com.praveen.biddingharbor.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    @Override
    public List<PendingAuctionResponse> getPendingAuctions() {

        return auctionRepository.findByAuctionStatus(
                        AuctionStatus.PENDING_APPROVAL)
                .stream()
                .map(auction -> new PendingAuctionResponse(
                        auction.getId(),
                        auction.getTitle(),
                        auction.getSeller().getUsername(),
                        auction.getStartingPrice(),
                        auction.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public AuctionResponse approveAuction(
            Long auctionId,
            String adminUsername) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found."));

        if (auction.isApproved()) {
            throw new AuctionAlreadyReviewedException(
                    "Auction already reviewed.");
        }

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() ->
                        new UserNotFoundException("Admin not found."));

        auction.setApproved(true);
        auction.setApprovedBy(admin);
        auction.setApprovalDate(LocalDateTime.now());
        auction.setAuctionStatus(AuctionStatus.DRAFT);

        auctionRepository.save(auction);

        return mapToResponse(auction);
    }

    @Override
    public AuctionResponse rejectAuction(
            Long auctionId,
            String adminUsername,
            ApprovalRequest request) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found."));

        if (auction.isApproved()) {
            throw new AuctionAlreadyReviewedException(
                    "Auction already reviewed.");
        }

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() ->
                        new UserNotFoundException("Admin not found."));

        auction.setApproved(false);
        auction.setApprovedBy(admin);
        auction.setApprovalDate(LocalDateTime.now());
        auction.setRejectionReason(request.reason());
        auction.setAuctionStatus(AuctionStatus.REJECTED);

        auctionRepository.save(auction);

        return mapToResponse(auction);
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