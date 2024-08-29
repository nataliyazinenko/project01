const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
  leaveAComment,
  updateArticle,
} = require("./models");
const fs = require("fs/promises");

exports.getEndpointsDocumentation = (req, res, next) => {
  fs.readFile("./endpoints.json", "utf-8")
    .then((contents) => {
      const parsedContents = JSON.parse(contents);
      res.status(200).send(parsedContents);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by } = req.query;
  fetchArticles(sort_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;
  fetchArticleComments(article_id, sort_by)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  leaveAComment(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  updateArticle(article_id).then((updatedArticle) => {
    res.status(200).send({ updatedArticle });
  });
};
