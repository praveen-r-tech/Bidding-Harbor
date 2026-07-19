package com.praveen.biddingharbor.service;

import com.praveen.biddingharbor.dto.UserLoginRequest;
import com.praveen.biddingharbor.dto.UserRegistrationRequest;
import com.praveen.biddingharbor.dto.UserResponse;

public interface UserService
{

    UserResponse register(UserRegistrationRequest request);

    UserResponse login(UserLoginRequest request);

}