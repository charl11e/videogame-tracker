package io.github.charl11e.videogame_tracker.dto;

import io.github.charl11e.videogame_tracker.model.GameStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class GameRequest {
    @NotBlank(message = "Title must not be blank")
    private String title;
    @NotBlank(message = "Platform must not be blank")
    private String platform;
    @NotNull(message = "Must provide a user ID")
    private Long userID;
    @Min(value = 0, message = "Progress must be at least 0")
    @Max(value = 100, message = "Progress must be less than 100")
    private Integer progress;
    @NotNull(message = "Must provide a status")
    private GameStatus status;
}
