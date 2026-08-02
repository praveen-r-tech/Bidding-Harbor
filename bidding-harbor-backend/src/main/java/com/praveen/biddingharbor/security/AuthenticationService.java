package com.praveen.biddingharbor.security;

import com.praveen.biddingharbor.dto.auth.AuthResponse;
import com.praveen.biddingharbor.dto.auth.UserLoginRequest;
import com.praveen.biddingharbor.dto.auth.UserRegistrationRequest;
import com.praveen.biddingharbor.dto.user.UserResponse;

public interface AuthenticationService {

    UserResponse register(UserRegistrationRequest request);

    AuthResponse login(UserLoginRequest request);

}