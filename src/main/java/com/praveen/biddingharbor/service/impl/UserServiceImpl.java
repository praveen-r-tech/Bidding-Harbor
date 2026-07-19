package com.praveen.biddingharbor.service.impl;

import com.praveen.biddingharbor.dto.UserLoginRequest;
import com.praveen.biddingharbor.dto.UserRegistrationRequest;
import com.praveen.biddingharbor.dto.UserResponse;
import com.praveen.biddingharbor.entity.User;
import com.praveen.biddingharbor.entity.enums.AccountStatus;
import com.praveen.biddingharbor.entity.enums.Role;
import com.praveen.biddingharbor.exception.InvalidCredentialsException;
import com.praveen.biddingharbor.exception.UserAlreadyExistsException;
import com.praveen.biddingharbor.exception.UserNotFoundException;
import com.praveen.biddingharbor.repository.UserRepository;
import com.praveen.biddingharbor.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService
{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse register(UserRegistrationRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            throw new UserAlreadyExistsException("Username already exists.");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException("Email already exists.");
        }

        User user = User.builder()
                .username(request.username())
                .displayName(request.displayName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .accountStatus(AccountStatus.ACTIVE)
                .emailVerified(false)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getDisplayName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getAccountStatus()
        );
    }

    @Override
    public UserResponse login(UserLoginRequest request) {

        User user = userRepository.findByUsername(request.usernameOrEmail())
                .or(() -> userRepository.findByEmail(request.usernameOrEmail()))
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password.");
        }

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus()
        );
    }
}