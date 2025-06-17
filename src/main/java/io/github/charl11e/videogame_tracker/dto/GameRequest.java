package io.github.charl11e.videogame_tracker.dto;

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
}
