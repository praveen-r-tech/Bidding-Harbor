package com.praveen.biddingharbor.controller;

import com.praveen.biddingharbor.dto.dashboard.AdminDashboardResponse;
import com.praveen.biddingharbor.dto.dashboard.SellerDashboardResponse;
import com.praveen.biddingharbor.dto.dashboard.UserDashboardResponse;
import com.praveen.biddingharbor.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/user")
    public UserDashboardResponse getUserDashboard(
            Authentication authentication) {

        return dashboardService.getUserDashboard(
                authentication.getName());
    }

    @GetMapping("/seller")
    public SellerDashboardResponse getSellerDashboard(
            Authentication authentication) {

        return dashboardService.getSellerDashboard(
                authentication.getName());
    }

    @GetMapping("/admin")
    public AdminDashboardResponse getAdminDashboard() {

        return dashboardService.getAdminDashboard();
    }
}