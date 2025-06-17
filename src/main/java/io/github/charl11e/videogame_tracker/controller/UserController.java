package io.github.charl11e.videogame_tracker.controller;

import io.github.charl11e.videogame_tracker.dto.UserRequest;
import io.github.charl11e.videogame_tracker.dto.UserResponse;

import io.github.charl11e.videogame_tracker.model.User;
import io.github.charl11e.videogame_tracker.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Add new user
    @PostMapping
    public UserResponse addUser(@RequestBody UserRequest userRequest) {
        User user = new User();

        // Save user
        user.setUsername(userRequest.getUsername());
        User savedUser = userRepository.save(user);

        // Response
        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        return response;
    }

    // List all users
    @GetMapping
    public List<UserResponse> listUsers() {
        List<User> users = userRepository.findAll();
        List<UserResponse> userResponses = new ArrayList<>();

        for (User user : users) {
            UserResponse response = new UserResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            userResponses.add(response);
        }

        return userResponses;
    }
}
