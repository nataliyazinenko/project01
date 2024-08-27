const express = require("express");
const {
  getAllTopics,
  getEndpointsDocumentation,
  getAllArticles,
  getArticleById,
} = require("./controllers");

const app = express();

app.use(express.json());

app.get("/api", getEndpointsDocumentation);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request." });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22003") {
    res
      .status(404)
      .send({ message: "The data with the given id was not found." });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.message === "Invalid sort_by.") {
    res.status(400).send(err);
  } else next(err);
});

module.exports = app;
