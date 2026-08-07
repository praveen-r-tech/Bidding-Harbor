import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/home/Home";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { AuctionList } from "../pages/auction/AuctionList";
import { AuctionDetails } from "../pages/auction/AuctionDetails";
import { SellerDashboard } from "../pages/seller/SellerDashboard";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { Profile } from "../pages/profile/Profile";
import { ProtectedRoute } from "../components/common/ProtectedRoute";

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auctions" element={<AuctionList />} />
            <Route path="/auctions/:id" element={<AuctionDetails />} />

            {/* Authenticated User Routes */}
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <SellerDashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/profile" 
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } 
            />

            {/* Admin Only Routes */}
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } 
            />

            {/* Fallback redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
