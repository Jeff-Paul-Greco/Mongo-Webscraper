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

            var titleCut = result.title.split("Continue", 1);
            console.log(titleCut);
            result.title = titleCut[0]

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

app.get("/saved", function (err, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.render("saved", {
                articles: dbArticle
            });
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/clear", function (err, res) {
    db.Article.deleteMany({})
        .then(function () {
            res.render("index");
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete("/delete/:id", function (req, res) {
    db.Article.deleteOne({_id: req.params.id})
        .then(function (dbArticles) {
            res.render("saved", {
                articles: dbArticles
            });
        })
        .catch(function (err) {
            res.json(err);
        });   
});

app.get("/articles/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id })

        .populate("comment")
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});


app.post("/articles/:id", function (req, res) {

    db.Comment.create(req.body)
        .then(function (dbComment) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});

app.put("/saved/:id", function (req, res) {
    db.Article.update( { _id: req.params.id }, { saved: true } ).then(
        function (dbArticle) {
            res.json(dbArticle);
        }
    );
});

app.get("*", function (req, res) {
    res.render("404");
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
