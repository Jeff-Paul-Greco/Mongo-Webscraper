# Mongoose Web Scraper

This app scrapes articles from Eventhubs.com - a video game news site. You can save articles to a favorites list where you can then leave and delete comments. This project utilizes Cheerio for scraping, Express for routing, Express Handlebars for templating, MongoDB and Mongoose for all database CRUD as well as Materialize for styling.

# Instructions

On the homepage, you will see a button on the navbar that says "Scrape Eventhubs". Clicking this scrapes the frontpage of Eventhubs.com and populates the screen with the most recent articles. On any article click the title to be linked to the article. Clicking the "Add" button will save this article and it will now populate in the saved page.

Click the link on the navbar that says "Saved Articles" and you will be taken to a page with your saved articles. Below each article will be two buttons - "Comment" and "Delete". "Delete" will remove this particular article from the database (the clear button on the navbar can also be clicked at any time to remove all scraped articles from the database). Clicking "Comment" will bring up a modal that will display all comments that have been posted on this article - each with a corresponding delete button. Beneath the comments will be a text field where a new comment can be entered. Clicking the "Post" button adds the comment entered in the field above it to the list of associated comments.

Deployed Link: https://floating-springs-04115.herokuapp.com/
