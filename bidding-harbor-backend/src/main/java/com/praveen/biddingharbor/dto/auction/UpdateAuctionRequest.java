package com.praveen.biddingharbor.dto.auction;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record UpdateAuctionRequest(

        @NotBlank
        String title,

        String description,

        @DecimalMin("0.01")
        BigDecimal minimumIncrement

) {
}