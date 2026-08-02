package com.praveen.biddingharbor.dto.auction;

import com.praveen.biddingharbor.entity.enums.AuctionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AuctionResponse(

        Long id,

        String title,

        String description,

        BigDecimal startingPrice,

        BigDecimal currentPrice,

        BigDecimal minimumIncrement,

        LocalDateTime startTime,

        LocalDateTime endTime,

        AuctionStatus status,

        String sellerUsername

) {
}