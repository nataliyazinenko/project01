const db = require("./connection");
const format = require("pg-format");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticles = (sort_by = "created_at") => {
  const sortableColumns = ["created_at"];
  if (!sortableColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Invalid sort_by." });
  }

  const queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, (SELECT COUNT (*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY ${sort_by} DESC`;

  return db.query(queryStr).then((result) => {
    result.rows.forEach((article) => {
      article.comment_count = Number(article.comment_count);
    });

    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ msg: "article does not exist" });
      }
      return article.rows[0];
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
      if (comments.rows.length === 0) {
        return Promise.reject({
          message:
            "This article hasn't received any comments or doesn't exist.",
        });
      }
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
