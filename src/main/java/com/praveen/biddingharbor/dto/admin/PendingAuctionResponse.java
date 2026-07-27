package com.praveen.biddingharbor.dto.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PendingAuctionResponse(

        Long id,

        String title,

        String seller,

        BigDecimal startingPrice,

        LocalDateTime createdAt

) {
}