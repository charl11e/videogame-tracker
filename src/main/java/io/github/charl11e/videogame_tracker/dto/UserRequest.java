package io.github.charl11e.videogame_tracker.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank(message = "Username must not be blank")
    private String username;
}
