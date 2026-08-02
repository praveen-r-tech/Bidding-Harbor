package com.praveen.biddingharbor.scheduler;

import com.praveen.biddingharbor.entity.Auction;
import com.praveen.biddingharbor.entity.Bid;
import com.praveen.biddingharbor.entity.enums.BidStatus;
import com.praveen.biddingharbor.entity.enums.AuctionStatus;
import com.praveen.biddingharbor.repository.AuctionRepository;
import com.praveen.biddingharbor.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;

    @Scheduled(fixedRate = 10000)
    public void updateAuctionStatuses() {

        LocalDateTime now = LocalDateTime.now();

        updateUpcomingAuctions(now);

        updateLiveAuctions(now);
    }

    private void updateUpcomingAuctions(LocalDateTime now) {

        List<Auction> auctions =
                auctionRepository.findByAuctionStatusAndStartTimeBefore(
                        AuctionStatus.UPCOMING,
                        now);

        for (Auction auction : auctions) {

            auction.setAuctionStatus(AuctionStatus.LIVE);

            auctionRepository.save(auction);

            log.info("Auction {} is now LIVE", auction.getId());
        }
    }

    private void updateLiveAuctions(LocalDateTime now) {

        List<Auction> auctions =
                auctionRepository.findByAuctionStatusAndEndTimeBefore(
                        AuctionStatus.LIVE,
                        now);

        for (Auction auction : auctions) {

            auction.setAuctionStatus(AuctionStatus.ENDED);

            bidRepository.findTopByAuctionOrderByBidAmountDesc(auction)
                    .ifPresent(winningBid -> {

                        auction.setWinner(winningBid.getBidder());

                        List<Bid> bids =
                                bidRepository.findByAuctionOrderByBidAmountDesc(auction);

                        for (Bid bid : bids) {

                            if (bid.getId().equals(winningBid.getId())) {

                                bid.setBidStatus(BidStatus.WON);

                            } else {

                                bid.setBidStatus(BidStatus.OUTBID);
                            }

                            bidRepository.save(bid);
                        }
                    });

            auctionRepository.save(auction);

            log.info("Auction {} has ENDED", auction.getId());
        }
    }
}