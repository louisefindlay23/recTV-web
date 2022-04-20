// Server Modules
const express = require("express");
const ejs = require("ejs");
const app = express();
const port = process.env.PORT;

require("dotenv").config();

// Initialising Express
app.use(express.static("public"));
// set the view engine to ejs
app.set("view engine", "ejs");

// Run server
app.listen(process.env.PORT);
console.log("Listening on " + process.env.PORT);

// Live reload Static Files
if (process.env.NODE_ENV === "development") {
    const livereload = require("livereload");
    const options = {
        port: process.env.RELOAD_PORT,
        extraExts: "ejs",
    };
    const liveReloadServer = livereload.createServer(options);
    const path = require("path");
    liveReloadServer.watch(path.join(__dirname, "public"));
    const connectLivereload = require("connect-livereload");
    // Setup Live Reload
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 50);
    });
    app.use(connectLivereload());
}

const MovieDB = require("node-themoviedb");
const mdb = new MovieDB(process.env.TMDB_API_KEY);

const movieRecommendations = async () => {
    try {
        const args = {
            pathParameters: {
                movie_id: 384018,
            },
        };
        const movie = await mdb.movie.getRecommendations(args);
        console.log(movie.data.results);
    } catch (error) {
        console.error(error);
    }
};

const tvRecommendations = async () => {
    try {
        const args = {
            pathParameters: {
                tv_id: 4046,
            },
        };
        const tv = await mdb.tv.getRecommendations(args);
        console.log(tv.data.results);
    } catch (error) {
        console.error(error);
    }
};

//movieRecommendations();
tvRecommendations();

// Root Route
app.get("/", function (req, res) {
    res.render("pages/index");
});
