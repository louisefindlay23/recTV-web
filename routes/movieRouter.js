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

module.exports = movieRouter;
