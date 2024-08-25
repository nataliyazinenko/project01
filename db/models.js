const db = require("./connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url FROM articles ORDER BY created_at DESC;"
    )
    .then((result) => {
      const articles = result.rows;

      const articlesWithCommentsCountsPromises = articles.map((article) => {
        const article_id = article.article_id;
        return countComments(article_id).then((count) => {
          article.comment_count = count;
          return article;
        });
      });

      return Promise.all(articlesWithCommentsCountsPromises);
    });
};

// this function will get a number of comments for article per article_id
async function countComments(article_id) {
  return db
    .query(
      "SELECT COUNT(comment_id) FROM comments WHERE comments.article_id = $1;",
      [article_id]
    )
    .then((result) => {
      const commentCount = Number(result.rows[0].count);
      return commentCount;
    });
}
exports.countComments = countComments;

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
