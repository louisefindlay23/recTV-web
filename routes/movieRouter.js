const express = require("express");

// Parse Form Data
const bodyParser = require("body-parser");

const axios = require("axios");

// Initialise Movie Router
const movieRouter = express.Router();
movieRouter.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
movieRouter.use(bodyParser.json());

// Movie Routes
movieRouter.get("/", function (req, res) {
    res.render("pages/index");
});

movieRouter.post("/search", function (req, res) {
    const searchQuery = req.body.searchbar;
    console.info("You searched for " + searchQuery);
    axios
        .get("https://api.themoviedb.org/3/search/movie", {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query: searchQuery,
            },
        })
        .then(function (response) {
            console.info(response.data.results);
            res.render("pages/movie/search", {
                movies: response,
                searchQuery: searchQuery,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

movieRouter.get("/collection/:collection", function (req, res) {
    axios
        .get(
            `https://api.themoviedb.org/3/collection/${req.params.collection}`,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                },
            }
        )
        .then(function (response) {
            //console.info(response.data);
            res.render("pages/movie/collection", {
                movie: response,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

async function dislikedRecommendations(genres) {
    let genre = genres[0].name;
    switch (genre) {
        case "Action":
            genre = 10751;
            console.info("Family");
            break;
        case "Adventure":
            genre = 10751;
            console.info("Family");
            break;
        case "Animation":
            genre = 14;
            console.info("Fantasy");
            break;
        case "Comedy":
            genre = 18;
            console.info("Drama");
            break;
        case "Crime":
            genre = 10752;
            console.info("War");
            break;
        case "Documentary":
            genre = 36;
            console.info("History");
            break;
        case "Drama":
            genre = 35;
            console.info("Comedy");
            break;
        case "Family":
            genre = 12;
            console.info("Adventure");
            break;
        case "Fantasy":
            genre = 16;
            console.info("Animation");
            break;
        case "History":
            genre = 80;
            console.info("Crime");
            break;
        case "Horror":
            genre = 878;
            console.info("Science Fiction");
            break;
        case "Music":
            genre = 53;
            console.info("Thriller");
            break;
        case "Mystery":
            genre = 80;
            console.info("Crime");
            break;
        case "Romance":
            genre = 10770;
            console.info("TV Movie");
            break;
        case "Science Fiction":
            genre = 14;
            console.info("Fantasy");
            break;
        case "TV Movie":
            genre = 10751;
            console.info("Family");
            break;
        case "Thriller":
            genre = 28;
            console.info("Action");
            break;
        case "War":
            genre = 28;
            console.info("Action");
            break;
        case "Western":
            genre = 10752;
            console.info("War");
            break;
        default:
            console.info(genre);
    }
    console.info(genre);
    return axios
        .get(`https://api.themoviedb.org/3/discover/movie`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                with_genres: genre,
            },
        })
        .then(function (response) {
            return response.data.results;
        })
        .catch(function (error) {
            console.log(error);
        });
}

movieRouter.get("/:id", function (req, res) {
    axios
        .get(`https://api.themoviedb.org/3/movie/${req.params.id}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                append_to_response: "recommendations",
            },
        })
        .then(async function (response) {
            const movie = response;
            const oppositeGenre = await dislikedRecommendations(
                response.data.genres
            );
            //console.info(oppositeGenre);
            if (movie.data.belongs_to_collection) {
                axios
                    .get(
                        `https://api.themoviedb.org/3/collection/${movie.data.belongs_to_collection.id}`,
                        {
                            params: {
                                api_key: process.env.TMDB_API_KEY,
                            },
                        }
                    )
                    .then(function (response) {
                        const collection = response;
                        //console.info(collection);
                        res.render("pages/movie/index", {
                            movie: movie,
                            dislikedRecommendations: oppositeGenre,
                            collection: collection,
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                res.render("pages/movie/index", {
                    movie: movie,
                    dislikedRecommendations: oppositeGenre,
                    collection: null,
                });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
});

module.exports = movieRouter;
