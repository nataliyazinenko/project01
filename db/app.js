const express = require("express");
const {
  getAllTopics,
  getEndpointsDocumentation,
  getAllArticles,
  getArticleById,
  getArticleComments,
  addComment,
  updateArticleById,
} = require("./controllers");

const app = express();

app.use(express.json());

app.get("/api", getEndpointsDocumentation);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", updateArticleById);

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

app.use((err, req, res, next) => {
  if (
    err.message ===
    "This article hasn't received any comments or doesn't exist."
  ) {
    res.status(404).send(err);
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.message === "User not found.") {
    res.status(400).send(err);
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.message === "Comment body missing.") {
    res.status(400).send(err);
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.message === "Username missing.") {
    res.status(400).send(err);
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ message: "Article id is not present." });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.message === "inc_votes is not a number") {
    res.status(400).send(err);
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.message === "inc_votes is not an integer") {
    res.status(400).send(err);
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err.message === "Article not found.") {
    res.status(404).send(err);
  } else next(err);
});

module.exports = app;
