# Screened

Web app entitled Screened, for logging the movies that the user has watched.

## Features
- Log in and accounts
  - The username and password can be hard coded (via env variables) for first version
- Allow the watched film to be entered via Title and Year
- It should be possible to select the film if there are multiple matches
- Show the movies in the order in which they were entered
- Support importing a list of films in csv format: film, year

## Design
- It should have a modern, dark theme
- It should be fully responsive, so I can run it on desktop and mobile
- Create a nice logo and appropriate favicons
- It should be possible to edit the TMDB id of the film in case the wrong movie is detected
- Show the watched films in a suitable format with the movie thumbnail, which can be obtained from TMDB. Clicking on the thumbnail should take the user to the film's page in TMDB

## Technical
- Include docker and docker compose files
- Add unit tests and GitHub actions to run them
- Allow the TMDB API key to provided in env variable
