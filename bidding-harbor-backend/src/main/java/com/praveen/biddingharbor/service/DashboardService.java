package com.praveen.biddingharbor.service;

import com.praveen.biddingharbor.dto.dashboard.AdminDashboardResponse;
import com.praveen.biddingharbor.dto.dashboard.SellerDashboardResponse;
import com.praveen.biddingharbor.dto.dashboard.UserDashboardResponse;

public interface DashboardService {

    UserDashboardResponse getUserDashboard(String username);

    SellerDashboardResponse getSellerDashboard(String username);

    AdminDashboardResponse getAdminDashboard();

}