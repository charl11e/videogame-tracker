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
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.http.MediaType;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

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

    @BeforeEach
    void setup() throws Exception {
        userRepository.deleteAll();
        gameRepository.deleteAll();

        // Set up a mock user to use during tests
        User user = new User();
        user.setUsername("Test User");
        mockMvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(user)));
    }

    // GET /api/users
    @Test
    public void returnsCorrectListOfUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect((status().isOk()))
                .andExpect(result -> {
                   String content = result.getResponse().getContentAsString();
                   assert content.contains("Test User");
                });
    }

    // POST /api/users
    @Test
    public void returnBadRequestAndMessageForEmptyUsername() throws Exception {
        User user = new User();
        user.setUsername("");
        mockMvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Username must not be blank");
                });
    }

    @Test
    public void returnOkAndMessageForValidUsername() throws Exception {
        User user = new User();
        user.setUsername("test");
        mockMvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(user)))
                .andExpect((status().isOk()))
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("test");
                });
    }

    // DEL /api/users
    @Test
    public void returnNotFoundAndMessageIfUserDoesNotExistDel() throws Exception {
        mockMvc.perform(delete("/api/users/999999"))
                .andExpect((status().isNotFound()))
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("User not found");
                });
    }

    @Test
    public void returnBadRequestAndMessageIfNumberNotProvidedDel() throws Exception {
        mockMvc.perform(delete("/api/users/test"))
                .andExpect((status().isBadRequest()))
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Illegal argument");
                });
    }

    @Test
    public void returnOkForValidUserId() throws Exception {
        mockMvc.perform(delete("/api/users/" + getUserId(mockMvc)))
                .andExpect(status().isOk());
    }

    // PUT /api/users/{id}
    @Test
    public void returnNotFoundAndMessageIfUserDoesNotExistPut() throws Exception {
        String body = "{ \"username\": \"Test\" }";
        mockMvc.perform(put("/api/users/999999").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isNotFound())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("User not found");
                });
    }

    @Test
    public void returnBadRequestAndMessageIfNumberNotProvidedPut() throws Exception {
        String body = "{ \"username\": \"Test\" }";
        mockMvc.perform(put("/api/users/test").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Illegal argument");
                });
    }

    @Test
    public void returnBadRequestAndMessageIfUsernameIsEmpty() throws Exception {
        String body = "{ \"username\": \"\" }";
        mockMvc.perform(put("/api/users/" + getUserId(mockMvc)).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Username must not be blank");
                });
    }

    @Test
    public void returnOkAndMessageForValidId() throws Exception {
        String body =  "{ \"username\": \"Test\" }";
        mockMvc.perform(put("/api/users/" + getUserId(mockMvc)).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Test");
                });
    }

    // GET /api/users/{id}/games
    @Test
    public void returnNotFoundAndMessageIfUserDoesNotExistGet() throws Exception {
        mockMvc.perform(get("/api/users/999999/games"))
                .andExpect(status().isNotFound())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("User ID not found");
                });
    }

    @Test
    public void returnBadRequestAndMessageIfNumberNotProvidedGet() throws Exception {
        mockMvc.perform(get("/api/users/test/games"))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Illegal argument");
                });
    }

    @Test
    public void returnNoGamesIfUserHasNoGames() throws Exception {
        mockMvc.perform(get("/api/users/" + getUserId(mockMvc) + "/games"))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("[]");
                });
    }

    @Test
    public void returnGamesIfUserHasGames() throws Exception {
        Long userId = getUserId(mockMvc);
        GameRequest gameRequest = new GameRequest();
        gameRequest.setTitle("Test Game");
        gameRequest.setPlatform("Test Platform");
        gameRequest.setProgress(0);
        gameRequest.setStatus(GameStatus.BACKLOG);
        gameRequest.setUserID(userId);
        mockMvc.perform(post("/api/games").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(gameRequest))).andExpect(status().isOk());

        mockMvc.perform(get("/api/users/" + userId + "/games"))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Test Game");
                    assert content.contains("Test Platform");
                });
    }

}