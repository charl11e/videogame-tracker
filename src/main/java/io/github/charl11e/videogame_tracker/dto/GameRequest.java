package io.github.charl11e.videogame_tracker.dto;

import lombok.Data;

@Data
public class GameRequest {
    private String title;
    private String platform;
    private Long userID;
}
