package com.praveen.biddingharbor.controller;

import com.praveen.biddingharbor.dto.UserLoginRequest;
import com.praveen.biddingharbor.dto.UserRegistrationRequest;
import com.praveen.biddingharbor.dto.UserResponse;
import com.praveen.biddingharbor.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController
{

    private final UserService userService;

    @PostMapping("/register")
    public UserResponse register(
            @Valid @RequestBody UserRegistrationRequest request) {

        return userService.register(request);
    }

    @PostMapping("/login")
    public UserResponse login(
            @Valid @RequestBody UserLoginRequest request) {

        return userService.login(request);
    }
}