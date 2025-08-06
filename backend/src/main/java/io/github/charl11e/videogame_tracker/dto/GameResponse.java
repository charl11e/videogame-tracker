package io.github.charl11e.videogame_tracker.dto;

import io.github.charl11e.videogame_tracker.model.GameStatus;
import lombok.Data;

@Data
public class GameResponse {
    private Long id;
    private String title;
    private String platform;
    private String username;
    private Integer progress;
    private GameStatus status;
    private String coverImage;
}
