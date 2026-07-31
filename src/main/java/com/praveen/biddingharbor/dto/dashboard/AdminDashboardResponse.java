package com.praveen.biddingharbor.dto.dashboard;

public record AdminDashboardResponse(

        long totalUsers,

        long totalAuctions,

        long pendingApprovals,

        long liveAuctions,

        long endedAuctions

) {
}