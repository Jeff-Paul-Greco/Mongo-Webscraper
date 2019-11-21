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

    axios.get("https://www.eventhubs.com/").then(function (response) {

        var $ = cheerio.load(response.data);

        $(".storyabstract").each(function (i, element) {

            var result = {};

            result.title = $(this)
                .children()
                .children()
                .text();
            result.link = "https://www.eventhubs.com" + $(this)
                .children()
                .children()
                .attr("href");
            result.description = $(this)
                .children("p + p")
                .text();

            result.description = result.description.replace(/ \ /g, "");
            result.title = result.title.replace(/ \ /g, "");


            db.Article.create(result)
                .then(function (dbArticle) {

                    console.log(dbArticle);
                })
                .catch(function (err) {

                    console.log(err);
                });

        });
        res.redirect("/");
    });
});

app.get("/", function (err, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.render("index", {
                articles: dbArticle
            });
        })
        .catch(function (err) {
            res.json(err);
        });

});

app.get("*", function (req, res) {
    res.render("404");
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
