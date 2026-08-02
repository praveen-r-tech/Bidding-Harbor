package com.praveen.biddingharbor.repository;

import com.praveen.biddingharbor.entity.Auction;
import com.praveen.biddingharbor.entity.User;
import com.praveen.biddingharbor.entity.enums.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Long>,
        JpaSpecificationExecutor<Auction> {

    List<Auction> findBySeller(User seller);

    Optional<Auction> findByIdAndSeller(Long id, User seller);

    List<Auction> findByAuctionStatus(AuctionStatus auctionStatus);

    List<Auction> findByApprovedFalse();

    List<Auction> findByAuctionStatusAndStartTimeBefore(
            AuctionStatus auctionStatus,
            LocalDateTime time);

    List<Auction> findByAuctionStatusAndEndTimeBefore(
            AuctionStatus auctionStatus,
            LocalDateTime time);

    long countBySeller(User seller);

    long countBySellerAndAuctionStatus(User seller, AuctionStatus auctionStatus);

    long countByAuctionStatus(AuctionStatus auctionStatus);

    @Query("""
       SELECT COALESCE(SUM(a.currentPrice), 0)
       FROM Auction a
       WHERE a.seller = :seller
       AND a.auctionStatus = com.praveen.biddingharbor.entity.enums.AuctionStatus.ENDED
       """)
    BigDecimal getSellerRevenue(User seller);

    long countByApprovedFalse();
}