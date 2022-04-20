const express = require("express");

// TMDB API
const MovieDB = require("node-themoviedb");
const mdb = new MovieDB(process.env.TMDB_API_KEY);

const movieID = "338953";

let movieRecommendations = async () => {
    try {
        const args = {
            pathParameters: {
                movie_id: movieID,
            },
        };
        const movie = await mdb.movie.getRecommendations(args);
        return movie;
    } catch (error) {
        console.error(error);
    }
};

let movieSearch = async (searchQuery) => {
    try {
        const args = {
            query: searchQuery,
        };
        const movie = await mdb.search.movies(args);
        return movie;
    } catch (error) {
        console.error(error);
    }
};

// Parse Form Data
const bodyParser = require("body-parser");

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
    movieRecommendations().then((movies) => {
        console.info(movies.data.results[0]);
        res.render("pages/movie/index", {
            movies: movies,
        });
    });
});

movieRouter.post("/search", function (req, res) {
    const searchQuery = req.body.searchbar;
    console.info("You searched for " + searchQuery);
    movieSearch(searchQuery)
        .then((movies) => {
            console.info(movies);
            res.render("pages/movie/search", {
                movies: movies,
            });
        })
        .catch((err) => {
            console.error(err);
        });
});

module.exports = movieRouter;
