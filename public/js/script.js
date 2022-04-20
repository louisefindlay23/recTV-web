const searchForm = document.getElementById("search-media");
searchForm.addEventListener("submit", function () {
    if (event.submitter.id === "search-tv") {
        searchForm.action = "/tv/search";
    } else if (event.submitter.id === "search-movie") {
        searchForm.action = "/movie/search";
    }
});
