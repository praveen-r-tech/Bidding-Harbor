package com.praveen.biddingharbor.service.impl;

import com.praveen.biddingharbor.dto.dashboard.AdminDashboardResponse;
import com.praveen.biddingharbor.dto.dashboard.SellerDashboardResponse;
import com.praveen.biddingharbor.dto.dashboard.UserDashboardResponse;
import com.praveen.biddingharbor.entity.User;
import com.praveen.biddingharbor.entity.enums.AuctionStatus;
import com.praveen.biddingharbor.repository.AuctionRepository;
import com.praveen.biddingharbor.repository.BidRepository;
import com.praveen.biddingharbor.repository.UserRepository;
import com.praveen.biddingharbor.service.DashboardService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;

    private User getUser(String username) {

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));
    }

    @Override
    public UserDashboardResponse getUserDashboard(String username) {

        User user = getUser(username);

        return new UserDashboardResponse(

                bidRepository.countByBidder(user),

                bidRepository.countWonAuctions(user),

                bidRepository.countActiveBids(user)
        );
    }

    @Override
    public SellerDashboardResponse getSellerDashboard(String username) {

        User seller = getUser(username);

        BigDecimal revenue = auctionRepository.getSellerRevenue(seller);

        if (revenue == null) {
            revenue = BigDecimal.ZERO;
        }

        return new SellerDashboardResponse(

                auctionRepository.countBySeller(seller),

                auctionRepository.countBySellerAndAuctionStatus(
                        seller,
                        AuctionStatus.LIVE
                ),

                auctionRepository.countBySellerAndAuctionStatus(
                        seller,
                        AuctionStatus.ENDED
                ),

                revenue
        );
    }

    @Override
    public AdminDashboardResponse getAdminDashboard() {

        return new AdminDashboardResponse(

                userRepository.count(),

                auctionRepository.count(),

                auctionRepository.countByApprovedFalse(),

                auctionRepository.countByAuctionStatus(
                        AuctionStatus.LIVE
                ),

                auctionRepository.countByAuctionStatus(
                        AuctionStatus.ENDED
                )
        );
    }
}