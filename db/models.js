const db = require("./connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticles = (sort_by) => {
  const queryStr =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, (SELECT COUNT (*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id;";
  const sortableColumns = [
    "author",
    "article_id",
    "topic",
    "created_at",
    "votes",
  ];

  if (sort_by) {
    if (!sortableColumns.includes(sort_by)) {
      return Promise.reject({ status: 400, message: "Bad request." });
    } else {
      queryStr += ` ORDER BY ${sort_by} DESC`;
    }
  }

  return db.query(queryStr).then((result) => {
    result.rows.forEach((article) => {
      article.comment_count = Number(article.comment_count);
      console.log("!!!", article);
      return article;
    });
    console.log("!!!???????", result.rows);
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
