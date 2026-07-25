package com.praveen.biddingharbor.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRegistrationRequest(

        @NotBlank(message = "Username is required")
        @Size(min = 4, max = 30)
        String username,

        @NotBlank(message = "Display name is required")
        @Size(max = 60)
        String displayName,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must contain at least 8 characters")
        String password

) {
}