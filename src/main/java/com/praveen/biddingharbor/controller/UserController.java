package com.praveen.biddingharbor.controller;

import com.praveen.biddingharbor.dto.user.ChangePasswordRequest;
import com.praveen.biddingharbor.dto.user.UpdateProfileRequest;
import com.praveen.biddingharbor.dto.user.UserResponse;
import com.praveen.biddingharbor.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            Authentication authentication) {

        return userService.getCurrentUser(authentication.getName());
    }

    @PutMapping("/me")
    public UserResponse updateProfile(

            Authentication authentication,

            @Valid
            @RequestBody
            UpdateProfileRequest request) {

        return userService.updateProfile(
                authentication.getName(),
                request);
    }

    @PutMapping("/change-password")
    public String changePassword(

            Authentication authentication,

            @Valid
            @RequestBody
            ChangePasswordRequest request) {

        userService.changePassword(
                authentication.getName(),
                request);

        return "Password changed successfully.";
    }

    @DeleteMapping("/me")
    public String deleteAccount(
            Authentication authentication) {

        userService.deleteAccount(
                authentication.getName());

        return "Account deleted successfully.";
    }
}