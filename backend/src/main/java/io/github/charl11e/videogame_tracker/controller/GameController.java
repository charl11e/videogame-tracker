package io.github.charl11e.videogame_tracker.controller;

import io.github.charl11e.videogame_tracker.dto.GameRequest;
import io.github.charl11e.videogame_tracker.dto.GameResponse;

import io.github.charl11e.videogame_tracker.exception.ResourceNotFoundException;
import io.github.charl11e.videogame_tracker.model.Game;
import io.github.charl11e.videogame_tracker.model.User;
import io.github.charl11e.videogame_tracker.repository.GameRepository;
import io.github.charl11e.videogame_tracker.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public GameController(GameRepository gameRepository, UserRepository userRepository) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    // Create a new game
    @PostMapping
    public GameResponse addGame(@Valid @RequestBody GameRequest gameRequest) {
        // Lookup user
        Optional<User> optionalUser = userRepository.findById(gameRequest.getUserID());
        if (optionalUser.isEmpty()) {
            throw new ResourceNotFoundException("User ID not found");
        }

        User user = optionalUser.get();

        // Create game
        Game game = new Game();
        game.setTitle(gameRequest.getTitle());
        game.setPlatform(gameRequest.getPlatform());
        game.setUser(user);
        game.setProgress(gameRequest.getProgress());
        game.setStatus(gameRequest.getStatus());

        Game savedGame = gameRepository.save(game);

        // Response
        GameResponse response = new GameResponse();
        response.setId(savedGame.getId());
        response.setTitle(savedGame.getTitle());
        response.setPlatform(savedGame.getPlatform());
        response.setUsername(savedGame.getUser().getUsername());
        response.setProgress(savedGame.getProgress());
        response.setStatus(savedGame.getStatus());

        return response;
    }

    // List all games
    @GetMapping
    public List<GameResponse> allGames() {
        List<Game> games = gameRepository.findAll();
        List<GameResponse> gameResponses = new ArrayList<>();

        for (Game game : games) {
            GameResponse response = new GameResponse();
            response.setId(game.getId());
            response.setTitle(game.getTitle());
            response.setPlatform(game.getPlatform());
            response.setUsername(game.getUser().getUsername());
            response.setProgress(game.getProgress());
            response.setStatus(game.getStatus());
            response.setCoverImage(game.getCoverImage());
            gameResponses.add(response);
        }

        return gameResponses;
    }

    // Delete game
    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable Long id) {
        Optional<Game> game = gameRepository.findById(id);
        if (game.isEmpty()) {
            throw new ResourceNotFoundException("Game not found");
        } else {

            // Delete game cover
            if (game.get().getCoverImage() != null && !game.get().getCoverImage().isEmpty()) {
                Path coverPath = Paths.get(System.getProperty("user.dir") + File.separator + "uploads", Paths.get(game.get().getCoverImage()).getFileName().toString());
                try {
                    Files.deleteIfExists(coverPath);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to delete image cover for game" + e.getMessage());
                }

            }
            gameRepository.delete(game.get());
        }

    }

    // Update game
    @PutMapping("/{id}")
    public GameResponse updateGame(@PathVariable Long id, @Valid @RequestBody GameRequest gameRequest) {
        Optional<Game> game = gameRepository.findById(id);
        if (game.isEmpty()) {
            throw new ResourceNotFoundException("Game not found");
        } else {

           Optional<User> user = userRepository.findById(gameRequest.getUserID());
           if (user.isEmpty()) {
               throw new ResourceNotFoundException("User ID not found");
           } else {

               game.get().setTitle(gameRequest.getTitle());
               game.get().setPlatform(gameRequest.getPlatform());
               game.get().setUser(user.get());
               game.get().setProgress(gameRequest.getProgress());
               game.get().setStatus(gameRequest.getStatus());
               Game updatedGame = gameRepository.save(game.get());

               GameResponse response = new GameResponse();
               response.setId(updatedGame.getId());
               response.setTitle(updatedGame.getTitle());
               response.setPlatform(updatedGame.getPlatform());
               response.setUsername(updatedGame.getUser().getUsername());
               response.setProgress(updatedGame.getProgress());
               response.setStatus(updatedGame.getStatus());

               return response;
           }

        }
    }

    // Update game art
    @PutMapping("/{id}/cover")
    public GameResponse updateGameCover(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<Game> game = gameRepository.findById(id);
        if (game.isEmpty()) {
            throw new ResourceNotFoundException("Game not found");
        } else {

            // Check the uploaded file is image
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Only image files are allowed to be uploaded");
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            try {
                File destFile = new File(uploadDir + File.separator + fileName);
                file.transferTo(destFile);
                game.get().setCoverImage("/uploads/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file", e);
            }

            Game updatedGame = gameRepository.save(game.get());

            GameResponse response = new GameResponse();
            response.setId(updatedGame.getId());
            response.setCoverImage(updatedGame.getCoverImage());
            response.setProgress(updatedGame.getProgress());
            response.setTitle(updatedGame.getTitle());
            response.setPlatform(updatedGame.getPlatform());
            response.setUsername(updatedGame.getUser().getUsername());
            response.setStatus(updatedGame.getStatus());

            return response;
        }
    }

}
