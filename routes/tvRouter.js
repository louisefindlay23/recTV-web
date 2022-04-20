const express = require("express");

// Parse Form Data
const bodyParser = require("body-parser");

const axios = require("axios");

// Initialise TV Router
const tvRouter = express.Router();
tvRouter.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
tvRouter.use(bodyParser.json());

// TV Routes
tvRouter.get("/", function (req, res) {
    res.render("pages/index");
});

tvRouter.post("/search", function (req, res) {
    const searchQuery = req.body.searchbar;
    console.info("You searched for " + searchQuery);
    axios
        .get("https://api.themoviedb.org/3/search/tv", {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query: searchQuery,
            },
        })
        .then(function (response) {
            console.info(response.data.results);
            res.render("pages/tv/search", {
                tv: response,
                searchQuery: searchQuery,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

tvRouter.get("/:id", function (req, res) {
    console.info(req.params.id);
    axios
        .get(`https://api.themoviedb.org/3/tv/${req.params.id}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                append_to_response: "recommendations",
            },
        })
        .then(function (response) {
            console.info(response.data);
            res.render("pages/tv/index", {
                tv: response,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

module.exports = tvRouter;
