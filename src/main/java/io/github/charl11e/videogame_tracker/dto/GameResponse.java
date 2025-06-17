package io.github.charl11e.videogame_tracker.dto;

import lombok.Data;

@Data
public class GameResponse {
    private Long id;
    private String title;
    private String platform;
    private String username;
}
