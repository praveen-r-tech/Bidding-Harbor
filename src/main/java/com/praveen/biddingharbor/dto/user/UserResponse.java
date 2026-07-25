package com.praveen.biddingharbor.dto.user;

import com.praveen.biddingharbor.entity.enums.AccountStatus;
import com.praveen.biddingharbor.entity.enums.Role;

public record UserResponse(

        Long id,

        String username,

        String displayName,

        String email,

        Role role,

        AccountStatus accountStatus

) {
}