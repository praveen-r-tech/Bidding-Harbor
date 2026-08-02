package com.praveen.biddingharbor.dto.auction;

import jakarta.validation.constraints.NotBlank;

public record RejectAuctionRequest(

        @NotBlank
        String reason

) {
}