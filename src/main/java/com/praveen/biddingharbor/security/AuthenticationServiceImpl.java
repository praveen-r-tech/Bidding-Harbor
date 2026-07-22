package com.praveen.biddingharbor.security;

import com.praveen.biddingharbor.dto.AuthResponse;
import com.praveen.biddingharbor.dto.UserLoginRequest;
import com.praveen.biddingharbor.dto.UserRegistrationRequest;
import com.praveen.biddingharbor.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final com.praveen.biddingharbor.service.UserService userService;

    @Override
    public UserResponse register(UserRegistrationRequest request) {
        return userService.register(request);
    }

    @Override
    public AuthResponse login(UserLoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.usernameOrEmail(),
                        request.password()
                )
        );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(request.usernameOrEmail());

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }
}