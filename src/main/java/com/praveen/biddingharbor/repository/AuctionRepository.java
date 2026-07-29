package com.praveen.biddingharbor.repository;

import com.praveen.biddingharbor.entity.Auction;
import com.praveen.biddingharbor.entity.User;
import com.praveen.biddingharbor.entity.enums.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Long> {

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
}