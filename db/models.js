const db = require("./connection");
const format = require("pg-format");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic,
  queryParameters = {}
) => {
  const sortableColumns = ["title", "topic", "author", "created_at", "votes"];
  const inOrder = ["ASC", "DESC"];
  const validQueryParameters = ["sort_by", "order", "topic"];
  const queryVals = [];

  for (const queryParameter in queryParameters) {
    if (!validQueryParameters.includes(queryParameter)) {
      return Promise.reject({
        status: 400,
        message: "Invalid query parameter.",
      });
    }
  }

  if (!sortableColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Invalid sort_by." });
  }

  if (!inOrder.includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid order query." });
  }

  let queryStr =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, (SELECT COUNT (*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id";

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryVals.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, queryVals).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Topic not found." });
    }

    result.rows.forEach((article) => {
      article.comment_count = Number(article.comment_count);
    });

    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, (SELECT COUNT (*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles WHERE articles.article_id = $1",
      [article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ msg: "article does not exist" });
      }

      const result = article.rows[0];
      result.comment_count = Number(result.comment_count);

      return result;
    });
};

exports.fetchArticleComments = (article_id, sort_by = "created_at") => {
  const sortableColumns = ["created_at"];

  if (!sortableColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Invalid sort_by." });
  }
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sort_by} DESC`,
      [article_id]
    )
    .then((comments) => {
      return comments.rows;
    });
};

exports.leaveAComment = (article_id, { body, username }) => {
  if (!body) {
    return Promise.reject({
      status: 400,
      message: "Comment body missing.",
    });
  }
  if (!username) {
    return Promise.reject({
      status: 400,
      message: "Username missing.",
    });
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 400, message: "User not found." });
      }
      return db
        .query(
          `INSERT INTO comments (body, article_id, author, votes, created_at) VALUES ($1, $2, $3, 0, NOW()) RETURNING *`,
          [body, article_id, username]
        )
        .then((result) => {
          return result.rows[0];
        });
    });
};

exports.updateArticle = (article_id, { inc_votes: newVote }) => {
  if (isNaN(newVote)) {
    return Promise.reject({
      status: 400,
      message: "inc_votes is not a number",
    });
  }
  if (!Number.isInteger(newVote)) {
    return Promise.reject({
      status: 400,
      message: "inc_votes is not an integer",
    });
  }

  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [newVote, article_id]
    )
    .then((updatedArticle) => {
      if (updatedArticle.rows.length === 0) {
        return Promise.reject({ message: "Article not found." });
      }
      return updatedArticle.rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ message: "Comment not found." });
      }
      return result;
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then((users) => {
    return users.rows;
  });
};
