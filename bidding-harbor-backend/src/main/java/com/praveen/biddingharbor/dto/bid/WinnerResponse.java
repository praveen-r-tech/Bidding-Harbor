package com.praveen.biddingharbor.dto.bid;

import java.math.BigDecimal;

public record WinnerResponse(

        Long auctionId,

        String winnerUsername,

        BigDecimal winningAmount

) {
}