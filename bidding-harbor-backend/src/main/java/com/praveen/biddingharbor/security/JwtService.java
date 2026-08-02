package com.praveen.biddingharbor.security;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService
{

    String generateToken(UserDetails userDetails);

    String extractUsername(String token);

    boolean isTokenValid(String token, UserDetails userDetails);

}