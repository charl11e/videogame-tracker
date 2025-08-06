package io.github.charl11e.videogame_tracker;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import io.github.charl11e.videogame_tracker.dto.GameRequest;
import io.github.charl11e.videogame_tracker.model.GameStatus;
import io.github.charl11e.videogame_tracker.model.User;
import io.github.charl11e.videogame_tracker.repository.GameRepository;
import io.github.charl11e.videogame_tracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    // Get user ID a user to add a game to
    private static Long getUserId(MockMvc mockMvc) throws Exception {
        String response = mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return JsonPath.parse(response).read("$[0].id", Long.class);
    }

    // Get a game id to test
    private static Long getGameId(MockMvc mockMvc) throws Exception {
        String response = mockMvc.perform(get("/api/games"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return JsonPath.parse(response).read("$[0].id", Long.class);
    }

    @BeforeEach
    void setup() throws Exception {
        userRepository.deleteAll();
        gameRepository.deleteAll();

        // Set up a mock user and game to use during test
        User user = new User();
        user.setUsername("Test");
        mockMvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(user)));

        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Title");
        gameRequest.setPlatform("Test Platform");
        gameRequest.setProgress(0);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(post("/api/games").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)));
    }

    // GET /api/games
    @Test
    public void returnsCorrectListOfGames() throws Exception {
        mockMvc.perform(get("/api/games"))
                .andExpect((status().isOk()))
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Test Title");
                    assert content.contains("Test Platform");
                });
    }

    // POST /api/games
    @Test
    public void returnBadRequestAndMessageForEmptyTitlePost() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("");
        gameRequest.setPlatform("Test Platform");
        gameRequest.setProgress(0);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(post("/api/games").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Title must not be blank");
                });
    }

    @Test
    public void returnBadRequestAndMessageForEmptyPlatformPost() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Title");
        gameRequest.setPlatform("");
        gameRequest.setProgress(0);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(post("/api/games").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Platform must not be blank");
                });
    }

    @Test
    public void returnBadRequestAndMessageForInvalidProgressPost() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Title");
        gameRequest.setPlatform("Test Platform");
        gameRequest.setProgress(-1);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(post("/api/games").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Progress must be at least 0");
                });
    }

    @Test
    public void returnBadRequestAndMessageForInvalidStatusPost() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Title");
        gameRequest.setPlatform("Test Platform");
        gameRequest.setProgress(0);
        gameRequest.setStatus(null);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(post("/api/games").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    System.out.println(content);
                    assert content.contains("Must provide a status");
                });
    }

    @Test
    public void returnNotFoundAndMessageIfUserDoesNotExistPost() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Title");
        gameRequest.setPlatform("Test Platform");
        gameRequest.setProgress(0);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(999999L);

        mockMvc.perform(post("/api/games").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isNotFound())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("User ID not found");
                });
    }

    @Test
    public void returnOkAndMessageIfGameIsValidPost() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Game");
        gameRequest.setPlatform("Test New Platform");
        gameRequest.setProgress(0);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(post("/api/games").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
            .andExpect(status().isOk())
            .andExpect(result -> {
                String content = result.getResponse().getContentAsString();
                assert content.contains("Test Game");
                assert content.contains("Test New Platform");
            });
    }

    // PUT /api/games/{id}
    @Test
    public void returnBadRequestAndMessageForEmptyTitlePut() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("");
        gameRequest.setPlatform("Test New Platform");
        gameRequest.setProgress(0);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(put("/api/games/" + getGameId(mockMvc)).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Title must not be blank");
                });
    }

    @Test
    public void returnBadRequestAndMessageForEmptyPlatformPut() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Game");
        gameRequest.setPlatform("");
        gameRequest.setProgress(0);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(put("/api/games/" + getGameId(mockMvc)).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Platform must not be blank");
                });
    }

    @Test
    public void returnBadRequestAndMessageForInvalidProgressPut() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Game");
        gameRequest.setPlatform("Test New Platform");
        gameRequest.setProgress(-99);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(put("/api/games/" + getGameId(mockMvc)).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Progress must be at least 0");
                });
    }

    @Test
    public void returnBadRequestAndMessageForInvalidStatusPut() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Game");
        gameRequest.setPlatform("Test New Platform");
        gameRequest.setProgress(0);
        gameRequest.setStatus(null);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(put("/api/games/" + getGameId(mockMvc)).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Must provide a status");
                });


    }

    @Test
    public void returnNotFoundAndMessageIfUserDoesNotExistPut() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Game");
        gameRequest.setPlatform("Test New Platform");
        gameRequest.setProgress(0);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(999999L);

        mockMvc.perform(put("/api/games/" + getGameId(mockMvc)).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isNotFound())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("User ID not found");
                });
    }

    @Test
    public void returnOkAndMessageIfGameIsValidPut() throws Exception {
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Game");
        gameRequest.setPlatform("Test New Platform");
        gameRequest.setProgress(0);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(getUserId(mockMvc));

        mockMvc.perform(put("/api/games/" + getGameId(mockMvc)).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(gameRequest)))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Test Game");
                    assert content.contains("Test New Platform");
                });
    }

    // DEL /api/games/{id}
    @Test
    public void returnNotFoundAndMessageIfGameDoesNotExist() throws Exception {
        mockMvc.perform(delete("/api/games/999999"))
                .andExpect(status().isNotFound())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Game not found");
                });
    }

    @Test
    public void returnBadRequestAndMessageIfNumberNotProvided() throws Exception {
        mockMvc.perform(delete("/api/games/test"))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Illegal argument");
                });
    }

    @Test
    public void returnOkForValidGameId() throws Exception {
        mockMvc.perform(delete("/api/games/" + getGameId(mockMvc)))
                .andExpect(status().isOk());
    }

    // PUT /api/games/{id}/cover
    @Test
    public void returnNotFoundAndMessageIfGameDoesNotExistPut() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "/image/png", "test content".getBytes());

        mockMvc.perform(multipart("/api/games/99999/cover").file(file).contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isNotFound())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Game not found");
                });
    }

    @Test
    public void returnBadRequestAndMessageIfImageFileNotProvided() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "test content".getBytes());

        mockMvc.perform(multipart("/api/games/" + getGameId(mockMvc) + "/cover").file(file).contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Only image files are allowed to be uploaded");
                });
    }

    @Test
    public void returnOkForValidGameIdAndValidImageFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/png", "test content".getBytes());

        mockMvc.perform(multipart("/api/games/" + getGameId(mockMvc) + "/cover").file(file).contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("test.png");
                });
    }
}