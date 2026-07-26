package com.praveen.biddingharbor.dto.bid;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PlaceBidRequest(

        @NotNull
        Long auctionId,

        @NotNull
        @DecimalMin("0.01")
        BigDecimal bidAmount

) {
}