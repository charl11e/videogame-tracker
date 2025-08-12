package io.github.charl11e.videogame_tracker;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.charl11e.videogame_tracker.model.User;
import io.github.charl11e.videogame_tracker.repository.UserRepository;

@SpringBootApplication
public class VideogameTrackerApplication {

	@Autowired
	private UserRepository userRepository;

	public static void main(String[] args) {
		SpringApplication.run(VideogameTrackerApplication.class, args);
	}

	@PostConstruct
	public void init() {
		if (userRepository.count() == 0) {
			User user = new User();
			user.setUsername("Default User");
			userRepository.save(user);
		}
	}

}
