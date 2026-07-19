package com.praveen.biddingharbor.dto;

import jakarta.validation.constraints.NotBlank;

public record UserLoginRequest(

        @NotBlank(message = "Username or Email is required")
        String usernameOrEmail,

        @NotBlank(message = "Password is required")
        String password

) {
}