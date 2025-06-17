package io.github.charl11e.videogame_tracker.repository;

import io.github.charl11e.videogame_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
