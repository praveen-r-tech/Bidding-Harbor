package com.praveen.biddingharbor.dto.admin;

import jakarta.validation.constraints.NotBlank;

public record ApprovalRequest(

        @NotBlank
        String reason

) {
}