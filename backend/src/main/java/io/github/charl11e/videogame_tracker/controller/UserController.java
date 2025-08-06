package io.github.charl11e.videogame_tracker.controller;

import io.github.charl11e.videogame_tracker.dto.UserRequest;
import io.github.charl11e.videogame_tracker.dto.UserResponse;
import io.github.charl11e.videogame_tracker.dto.GameResponse;

import io.github.charl11e.videogame_tracker.exception.ResourceNotFoundException;
import io.github.charl11e.videogame_tracker.model.User;
import io.github.charl11e.videogame_tracker.model.Game;
import io.github.charl11e.videogame_tracker.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") // Can be removed after development
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Add new user
    @PostMapping
    public UserResponse addUser(@Valid @RequestBody UserRequest userRequest) {
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

    // Return all games associated with a user ID
    @GetMapping("/{userid}/games")
    public List<GameResponse> getGames(@PathVariable Long userid) {
        Optional<User> checkUser = userRepository.findById(userid);
        if (checkUser.isEmpty()) {
            throw new ResourceNotFoundException("User ID not found");
        }

        User user = checkUser.get();
        List<GameResponse> gameResponses = new ArrayList<>();

        for (Game game : user.getGames()) {
            GameResponse response = new GameResponse();
            response.setId(game.getId());
            response.setTitle(game.getTitle());
            response.setPlatform(game.getPlatform());
            response.setUsername(user.getUsername());
            response.setStatus(game.getStatus());
            response.setProgress(game.getProgress());
            response.setCoverImage(game.getCoverImage());
            gameResponses.add(response);
        }

        return gameResponses;
    }

    // Delete user (will also delete all games associated with user too )
    @DeleteMapping("/{userid}")
    public void deleteUser(@PathVariable Long userid) {
        Optional<User> user = userRepository.findById(userid);
        if (user.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        } else {
            userRepository.delete(user.get());
        }
    }

    // Update user
    @PutMapping("/{userid}")
    public UserResponse updateUser(@PathVariable Long userid, @Valid @RequestBody UserRequest userRequest) {
        Optional<User> user = userRepository.findById(userid);
        if (user.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        } else {
            user.get().setUsername(userRequest.getUsername());
            User updatedUser = userRepository.save(user.get());

            UserResponse response = new UserResponse();
            response.setId(updatedUser.getId());
            response.setUsername(updatedUser.getUsername());

            return response;
        }
    }
}
