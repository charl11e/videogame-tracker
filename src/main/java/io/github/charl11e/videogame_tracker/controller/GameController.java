package io.github.charl11e.videogame_tracker.controller;

import io.github.charl11e.videogame_tracker.model.Game;
import io.github.charl11e.videogame_tracker.repository.GameRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameRepository gameRepository;

    public GameController(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    // Create new game
    @PostMapping
    public Game addGame(@RequestBody Game game) {
        return gameRepository.save(game);
    }

    // List all games
    @GetMapping
    public List<Game> allGames() {
        return gameRepository.findAll();
    }

}
