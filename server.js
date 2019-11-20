const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");

const db = require("./models");

const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {

    axios.get("https://www.reddit.com/").then(function (response) {

        var $ = cheerio.load(response.data);

        $("h3").each(function (i, element) {

            var result = {};

            result.title = $(this)
                .text();
            result.link = $(this)
                .parent()
                .parent("a")
                .attr("href");
            result.description = $(this)
                .text();

            db.Article.create(result)
                .then(function (dbArticle) {

                    console.log(dbArticle);
                })
                .catch(function (err) {

                    console.log(err);
                });
        });

        res.send("Scrape Complete");
    });
});

app.get("/", function (err, res) {
    res.render("index");
});

app.get("*", function (req, res) {
    res.render("404");
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
