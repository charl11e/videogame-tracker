package io.github.charl11e.videogame_tracker.repository;

import io.github.charl11e.videogame_tracker.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
}