package com.praveen.biddingharbor.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(

        @NotBlank(message = "Display name is required")
        @Size(min = 3, max = 60)
        String displayName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email")
        String email
) {
}