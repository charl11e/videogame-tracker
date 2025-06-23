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

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") // Can be removed after development
@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public GameController(GameRepository gameRepository, UserRepository userRepository) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    // Create new game
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

        Game savedGame = gameRepository.save(game);

        // Response
        GameResponse response = new GameResponse();
        response.setId(savedGame.getId());
        response.setTitle(savedGame.getTitle());
        response.setPlatform(savedGame.getPlatform());
        response.setUsername(savedGame.getUser().getUsername());

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

               Game updatedGame = gameRepository.save(game.get());

               GameResponse response = new GameResponse();
               response.setId(updatedGame.getId());
               response.setTitle(updatedGame.getTitle());
               response.setPlatform(updatedGame.getPlatform());
               response.setUsername(updatedGame.getUser().getUsername());

               return response;
           }

        }
    }

}
