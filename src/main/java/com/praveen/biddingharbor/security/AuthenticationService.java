package com.praveen.biddingharbor.security;

import com.praveen.biddingharbor.dto.AuthResponse;
import com.praveen.biddingharbor.dto.UserLoginRequest;
import com.praveen.biddingharbor.dto.UserRegistrationRequest;
import com.praveen.biddingharbor.dto.UserResponse;

public interface AuthenticationService {

    UserResponse register(UserRegistrationRequest request);

    AuthResponse login(UserLoginRequest request);

}