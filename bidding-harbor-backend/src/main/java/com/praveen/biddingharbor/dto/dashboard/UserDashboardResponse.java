package com.praveen.biddingharbor.dto.dashboard;

public record UserDashboardResponse(

        long myBids,

        long wonAuctions,

        long activeBids

) {
}