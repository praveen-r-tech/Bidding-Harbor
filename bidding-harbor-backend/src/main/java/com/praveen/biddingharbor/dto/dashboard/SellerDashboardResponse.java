package com.praveen.biddingharbor.dto.dashboard;

import java.math.BigDecimal;

public record SellerDashboardResponse(

        long totalAuctions,

        long liveAuctions,

        long endedAuctions,

        BigDecimal totalRevenue

) {
}