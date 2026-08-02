package com.praveen.biddingharbor.service.impl;

import com.praveen.biddingharbor.dto.auth.UserRegistrationRequest;
import com.praveen.biddingharbor.dto.user.UserResponse;
import com.praveen.biddingharbor.entity.User;
import com.praveen.biddingharbor.entity.enums.AccountStatus;
import com.praveen.biddingharbor.entity.enums.Role;
import com.praveen.biddingharbor.dto.user.ChangePasswordRequest;
import com.praveen.biddingharbor.dto.user.UpdateProfileRequest;
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
    public UserResponse getCurrentUser(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus()
        );
    }

    @Override
    public UserResponse updateProfile(
            String username,
            UpdateProfileRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        if (!user.getEmail().equals(request.email())
                && userRepository.existsByEmail(request.email())) {

            throw new UserAlreadyExistsException(
                    "Email already exists.");
        }

        user.setDisplayName(request.displayName());
        user.setEmail(request.email());

        User updatedUser = userRepository.save(user);

        return new UserResponse(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getDisplayName(),
                updatedUser.getEmail(),
                updatedUser.getRole(),
                updatedUser.getAccountStatus()
        );
    }

    @Override
    public void changePassword(
            String username,
            ChangePasswordRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        if (!passwordEncoder.matches(
                request.oldPassword(),
                user.getPassword())) {

            throw new InvalidCredentialsException(
                    "Old password is incorrect.");
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.newPassword()));

        userRepository.save(user);
    }

    @Override
    public void deleteAccount(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        userRepository.delete(user);
    }
}