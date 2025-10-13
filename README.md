# Entertainment App Backend

This document outlines the backend implementation for the Entertainment App, which includes setting up a MongoDB Atlas database, creating a Node.js server with Express.js, and implementing various API endpoints for user authentication, data retrieval, and bookmark management.

## Database Design

### Background

The database architect has constructed the database using MongoDB queries and populated it with data extracted from the TMDB API. As a developer, you need to design a database schema that can accommodate the latest Movie/TV Series data. You will create the necessary collections and documents, such as user documents for user information, orders documents for capturing relevant orders data, and a search document for including Movie/TV Series according to user searches.

**Mandatory:** The database should be created using MongoDB Atlas, and the data should be populated in JSON format only.

### Collections and Documents

- **Users**: Store user information (email, password, etc.)
- **Movies**: Store movie details from TMDB API
- **TVSeries**: Store TV series details from TMDB API
- **Bookmarks**: Store user bookmarks

## Node.js Server Creation

### Background

After constructing the database in MongoDB Atlas, you need to create a Node.js project that establishes a connection with the MongoDB Atlas database. This will include retrieving data from the database and designing appropriate models that align with the database schema.

**Mandatory:** The Node.js project should be built using the Express.js framework. The database connection should be established using the MongoDB dependency, and the data should be retrieved in JSON format.

## Setting Up the Project

### 1. Initialize the Project

npm run start


## API Endpoints

### User Authentication

- **POST** `/api/signup`
  - *Description:* Allows users to sign up.

- **POST** `/api/login`
  - *Description:* Allows users to log in.

### User Management

- **GET** `/api/users`
  - *Description:* Retrieves all users.

- **GET** `/api/userid`
  - *Description:* Retrieves a specific user by ID.

### Search

- **GET** `/api/search`
  - *Description:* Retrieves Movie/TV Series based on user's search.

### Movies

- **POST** `/api/admin/set/movies`
  - *Description:* Sets new movies in the database.

- **GET** `/api/get/all/movies`
  - *Description:* Retrieves all movies.

- **GET** `/api/get/movie`
  - *Description:* Retrieves a specific movie.

- **POST** `/api/bookmark/set/movie`
  - *Description:* Sets a movie as bookmarked.

- **GET** `/api/bookmark/get/movies`
  - *Description:* Retrieves bookmarked movies.

- **DELETE** `/api/bookmark/delete/movie/:id`
  - *Description:* Deletes a movie from bookmarks by ID.

### TV Series

- **POST** `/api/admin/set/tvseries`
  - *Description:* Sets new TV series in the database.

- **GET** `/api/get/all/tvseries`
  - *Description:* Retrieves all TV series.

- **GET** `/api/get/tvseries`
  - *Description:* Retrieves a specific TV series.

- **POST** `/api/bookmark/set/tvseries`
  - *Description:* Sets a TV series as bookmarked.

- **GET** `/api/bookmark/get/tvseries`
  - *Description:* Retrieves bookmarked TV series.

- **DELETE** `/api/bookmark/delete/tvseries/:id`
  - *Description:* Deletes a TV series from bookmarks by ID.
