package com.praveen.biddingharbor.dto.auction;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateAuctionRequest(

        @NotBlank
        String title,

        String description,

        @NotNull
        @DecimalMin("1.0")
        BigDecimal startingPrice,

        @NotNull
        @DecimalMin("1.0")
        BigDecimal minimumIncrement,

        @NotNull
        @Future
        LocalDateTime startTime,

        @NotNull
        @Future
        LocalDateTime endTime

) {}