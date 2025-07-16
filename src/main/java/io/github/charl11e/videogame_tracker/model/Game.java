package io.github.charl11e.videogame_tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Entity
@Table(name = "games")
@Data
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String platform;

    @ManyToOne
    private User user;

    @Min(0)
    @Max(100)
    private Integer progress = 0;

    @Enumerated(EnumType.STRING)
    private GameStatus status;

    private String coverImage; // "/uploads/<filename>"
}
