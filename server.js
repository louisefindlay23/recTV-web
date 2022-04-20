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

// Root Route
app.get("/", function (req, res) {
    res.render("pages/index");
});

// Movies Routes
const movieRoutes = require("./routes/movieRouter");
app.use("/movie", movieRoutes);

// TV Shows Routes
const tvRoutes = require("./routes/tvRouter");
app.use("/tv", tvRoutes);

// 404 Route
app.use(function (req, res) {
    res.status(404).render("pages/404");
});
