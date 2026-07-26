package com.praveen.biddingharbor.dto.bid;

import com.praveen.biddingharbor.entity.enums.BidStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BidResponse(

        Long id,

        Long auctionId,

        String bidderUsername,

        BigDecimal bidAmount,

        LocalDateTime bidTime,

        BidStatus bidStatus

) {
}