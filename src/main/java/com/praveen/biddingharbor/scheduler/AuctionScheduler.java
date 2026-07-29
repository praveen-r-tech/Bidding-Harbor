package com.praveen.biddingharbor.scheduler;

import com.praveen.biddingharbor.entity.Auction;
import com.praveen.biddingharbor.entity.enums.AuctionStatus;
import com.praveen.biddingharbor.repository.AuctionRepository;
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

            auctionRepository.save(auction);

            log.info("Auction {} has ENDED", auction.getId());
        }
    }
}