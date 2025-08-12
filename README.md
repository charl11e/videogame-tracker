# Videogame Tracker

Full-stack web application for tracking your videogame collection.  
Built with React and Spring Boot, using a H2 file-based database

## Features
- Supports multiple users
- Add, edit and delete games for each user
- Track game progress and status
- Upload custom cover images
- Filter and sort games

## Getting Started

### Prerequisites
The application can be run either using Docker (recommended) or natively using:
- node.js (v20+)
- Java (v21+) with Maven

### Running with Docker
1. Build and start the containers:
```sh
docker compose up
```

2. Access the app at [http://localhost:3000](http://localhost:3000)

### Running natively
1) Go to `backend/`

2) Start the Spring Boot API:
```sh
 ./mvnw spring-boot:run
 ```

3) Go to `frontend/`

4) Install frontend dependencies:
```sh
npm install
```

5) Start the React app:
```sh
npm start
```

6) Access the app at [http://localhost:3000](http://localhost:3000)

### Config
- The frontend by default runs on port 3000
- The backend by default runs on port 8080
- CORS is automatically configured to work for running either with Docker or locally
- It is recommended to not change these unless you know what you are doing
- These can be configured by modifying the variables in `frontend/.env`, `backend/src/main/resources/application.properties` and `docker-compose.yml`. You may need to modify the CORS config in `backend/src/main/java/config/WebConfig.java` to allow the frontend to send requests to the backend
- Database located in `backend/data` (H2 file database)
- Uploaded images are stored in the `uploads/` directory.
- A default user will be automatically created if no user exists on starting the app

### API Documentation
The frontend handles all API requests for normal use of the app, however you can see the Postman documentation below if you wish to learn about it/modify the app:
- [Documentation](https://documenter.getpostman.com/view/33001241/2sB3BDHq7U)

### License
[MIT](license.md)