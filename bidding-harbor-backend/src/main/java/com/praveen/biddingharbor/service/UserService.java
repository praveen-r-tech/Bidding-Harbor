package com.praveen.biddingharbor.service;

import com.praveen.biddingharbor.dto.auth.UserRegistrationRequest;
import com.praveen.biddingharbor.dto.user.ChangePasswordRequest;
import com.praveen.biddingharbor.dto.user.UpdateProfileRequest;
import com.praveen.biddingharbor.dto.user.UserResponse;

public interface UserService
{

    UserResponse register(UserRegistrationRequest request);

    UserResponse getCurrentUser(String username);

    UserResponse updateProfile(
            String username,
            UpdateProfileRequest request);

    void changePassword(
            String username,
            ChangePasswordRequest request);

    void deleteAccount(String username);

}