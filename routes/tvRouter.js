const express = require("express");

// TMDB API
const MovieDB = require("node-themoviedb");
const mdb = new MovieDB(process.env.TMDB_API_KEY);

const tvID = "95480";

const tvRecommendations = async () => {
    try {
        const args = {
            pathParameters: {
                tv_id: tvID,
            },
        };
        const tv = await mdb.tv.getRecommendations(args);
        return tv.data.results;
    } catch (error) {
        console.error(error);
    }
};

let tvSearch = async (searchQuery) => {
    try {
        const args = {
            query: searchQuery,
        };
        const tv = await mdb.search.TVShows(args);
        return tv;
    } catch (error) {
        console.error(error);
    }
};

// Parse Form Data
const bodyParser = require("body-parser");

// Initialise TV Router
const tvRouter = express.Router();
tvRouter.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
tvRouter.use(bodyParser.json());

// Spotify Routes
tvRouter.get("/", function (req, res) {
    const data = tvRecommendations();
    console.info(data);
    res.render("pages/tv/index");
});

tvRouter.post("/search", function (req, res) {
    const searchQuery = req.body.searchbar;
    console.info("You searched for " + searchQuery);
    tvSearch(searchQuery)
        .then((shows) => {
            console.info(shows);
            res.render("pages/tv/search", {
                shows: shows,
            });
        })
        .catch((err) => {
            console.error(err);
        });
});

module.exports = tvRouter;
