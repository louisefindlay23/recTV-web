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
            // console.info(response.data.results);
            res.render("pages/tv/search", {
                tv: response,
                searchQuery: searchQuery,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

tvRouter.get("/:tv/season/:season", function (req, res) {
    axios
        .get(
            `https://api.themoviedb.org/3/tv/${req.params.tv}/season/${req.params.season}`,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                },
            }
        )
        .then(function (response) {
            //console.info(response.data);
            res.render("pages/tv/season", {
                tv: response,
                id: req.params.tv,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

tvRouter.get("/:tv/season/:season/episode/:episode", function (req, res) {
    axios
        .get(
            `https://api.themoviedb.org/3/tv/${req.params.tv}/season/${req.params.season}/episode/${req.params.episode}`,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                },
            }
        )
        .then(function (response) {
            //console.info(response.data);
            res.render("pages/tv/episode", {
                tv: response,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

async function dislikedRecommendations(genres) {
    let genre = genres[0].name;
    switch (genre) {
        case "Action & Adventure":
            genre = 10751;
            console.info("Family");
            break;
        case "Animation":
            genre = 10762;
            console.info("Kids");
            break;
        case "Comedy":
            genre = 18;
            console.info("Drama");
            break;
        case "Crime":
            genre = 10768;
            console.info("War & Politics");
            break;
        case "Documentary":
            genre = 10764;
            console.info("Reality");
            break;
        case "Drama":
            genre = 35;
            console.info("Comedy");
            break;
        case "Family":
            genre = 10762;
            console.info("Kids");
            break;
        case "Kids":
            genre = 16;
            console.info("Animation");
            break;
        case "Mystery":
            genre = 80;
            console.info("Crime");
            break;
        case "News":
            genre = 10763;
            console.info("News");
            break;
        case "Reality":
            genre = 10766;
            console.info("Soap");
            break;
        case "Sci-Fi & Fantasy":
            genre = 10759;
            console.info("Action & Adventure");
            break;
        case "Soap":
            genre = 10764;
            console.info("Reality");
            break;
        case "Talk":
            genre = 99;
            console.info("Documentary");
            break;
        case "War & Politics":
            genre = 10767;
            console.info("Talk");
            break;
        case "Western":
            genre = 10759;
            console.info("Action & Adventure");
            break;
        default:
            console.info(genre);
    }
    console.info(genre);
    return axios
        .get(`https://api.themoviedb.org/3/discover/tv`, {
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

tvRouter.get("/:id", function (req, res) {
    axios
        .get(`https://api.themoviedb.org/3/tv/${req.params.id}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                append_to_response: "recommendations",
            },
        })
        .then(async function (response) {
            //console.info(response.data);
            const oppositeGenre = await dislikedRecommendations(
                response.data.genres
            );
            //console.info(oppositeGenre);
            res.render("pages/tv/index", {
                tv: response,
                dislikedRecommendations: oppositeGenre,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

module.exports = tvRouter;
