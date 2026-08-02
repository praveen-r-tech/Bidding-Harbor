package com.praveen.biddingharbor.controller;

import com.praveen.biddingharbor.dto.auth.AuthResponse;
import com.praveen.biddingharbor.dto.auth.UserLoginRequest;
import com.praveen.biddingharbor.dto.auth.UserRegistrationRequest;
import com.praveen.biddingharbor.dto.user.UserResponse;
import com.praveen.biddingharbor.security.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public UserResponse register(
            @Valid @RequestBody UserRegistrationRequest request) {

        return authenticationService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody UserLoginRequest request) {

        return authenticationService.login(request);
    }
}