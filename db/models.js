const db = require("./connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticles = (sort_by) => {
  let queryStr =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, (SELECT COUNT (*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id";
  const sortableColumns = ["created_at"];

  if (sort_by) {
    if (sortableColumns.includes(sort_by)) {
      queryStr += ` ORDER BY ${sort_by} DESC`;
    } else {
      return Promise.reject({ status: 400, message: "Invalid sort_by." });
    }
  }

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

exports.fetchArticleComments = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({
          msg: "This article hasn't received any comments.",
        });
      }
      console.log(comments.rows);
      return comments.rows;
    });
};
