package com.praveen.biddingharbor.repository;

import com.praveen.biddingharbor.entity.Auction;
import com.praveen.biddingharbor.entity.Bid;
import com.praveen.biddingharbor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByAuctionOrderByBidAmountDesc(Auction auction);

    List<Bid> findByAuctionOrderByBidTimeDesc(Auction auction);

    List<Bid> findByBidder(User bidder);

    Optional<Bid> findTopByAuctionOrderByBidAmountDesc(Auction auction);

    //List<Bid> findByAuction(Auction auction);
}