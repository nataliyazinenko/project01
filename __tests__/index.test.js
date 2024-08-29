const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../db/app");
const request = require("supertest");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics tests", () => {
  test("200: sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBeGreaterThan(0);
        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("404: endpoint that does not exist", () => {
    return request(app).get("/api/unknownendpoint").expect(404);
  });
});

describe("/api tests", () => {
  test("200: documents available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("GET /api");
        expect(response.body).toHaveProperty("GET /api/topics");
      });
  });
});

describe("/api/articles/:article_id tests", () => {
  test("200: sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article).toHaveProperty("author");
        expect(response.body.article).toHaveProperty("title");
        expect(response.body.article).toHaveProperty("article_id");
        expect(response.body.article).toHaveProperty("body");
        expect(response.body.article).toHaveProperty("topic");
        expect(response.body.article).toHaveProperty("created_at");
        expect(response.body.article).toHaveProperty("votes");
        expect(response.body.article).toHaveProperty("article_img_url");
      });
  });

  test("400: responds with bad request for invalid article id", () => {
    return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request.");
      });
  });

  test("404: responds with not found for valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/11111111111111111111111")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          "The data with the given id was not found."
        );
      });
  });

  test("200: sends an array of all articles if article id is not specified", () => {
    return request(app).get("/api/articles/").expect(200);
  });
});

describe("/api/articles tests", () => {
  test("200: sends an array of articles, sorted by date in descendig order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSorted({ descending: true });
        expect(response.body.articles.length).toBe(13);
        expect(Array.isArray(response.body.articles)).toBeTruthy();
      });
  });
  test("200: each article should have the properties of author, title, article_id, topic, created_at, votes, article_img_url and not have a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: each article should have the comment_count, which is the total count of all the comments with this article_id.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles[0].comment_count).toBe(2);
      });
  });
  test("200: accepts a created_at query and sorts the articles by date in descending order.", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("404: incorrect endpoint", () => {
    return request(app).get("/api/articules").expect(404);
  });
  test("400: invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=something")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid sort_by.");
      });
  });
});

describe("GET:/api/articles/:article_id/comments tests", () => {
  test("200: get all comments for an article, sorted by date in descendng order", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSorted({ descending: true });
        expect(response.body.comments).toMatchObject([
          {
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: "butter_bridge",
            votes: 16,
            created_at: "2020-04-06T12:17:00.000Z",
          },
          {
            comment_id: 17,
            body: "The owls are not what they seem.",
            article_id: 9,
            author: "icellusedkars",
            votes: 20,
            created_at: "2020-03-14T17:02:00.000Z",
          },
        ]);
      });
  });
  test("200: accepts a created_at query and sorts the comments by date in descending order.", () => {
    return request(app)
      .get("/api/articles/9/comments?sort_by=created_at")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("400: invalid sort_by query", () => {
    return request(app)
      .get("/api/articles/9/comments?sort_by=hello")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid sort_by.");
      });
  });
  test("404: valid article_id but this article doesn't have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          "This article hasn't received any comments or doesn't exist."
        );
      });
  });
  test("400: invalid article_id", () => {
    return request(app)
      .get("/api/articles/nine/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request.");
      });
  });
});

describe("POST:/api/articles/:article_id/comments tests", () => {
  test("201: posts a new comment for an article", () => {
    const newComment = {
      username: "rogersop",
      body: "yes, it's a comment",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment.author).toBe("rogersop");
        expect(response.body.comment.body).toBe("yes, it's a comment");
        expect(response.body.comment.article_id).toBe(9);
      });
  });
  test("400: non-existent username", () => {
    const newComment = {
      username: "notauser",
      body: "yes, it's a comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("User not found.");
      });
  });
  test("400: invalid article_id", () => {
    const newComment = {
      username: "rogersop",
      body: "yes, it's a comment",
    };
    return request(app)
      .post("/api/articles/two/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request.");
      });
  });
  test("400: comment body not provided", () => {
    const newComment = {
      username: "rogersop",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Comment body missing.");
      });
  });
  test("400: username not provided", () => {
    const newComment = {
      body: "yes, it's a comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Username missing.");
      });
  });
  test("400: valid but non-existent article_id", () => {
    const newComment = {
      username: "rogersop",
      body: "yes, it's a comment",
    };
    return request(app)
      .post("/api/articles/101010101/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Article id is not present.");
      });
  });
});

describe("PATCH:/api/articles/:article_id tests", () => {
  test("200: updates article votes (increments)", () => {
    const update = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then((response) => {
        expect(response.body.updatedArticle.votes).toBe(110);
      });
  });
  test("200: updates article votes (decrements)", () => {
    const update = { inc_votes: -20 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then((response) => {
        expect(response.body.updatedArticle.votes).toBe(80);
      });
  });
  test("400: inc_votes is not a number", () => {
    const update = { inc_votes: "ten" };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("inc_votes is not a number");
      });
  });
  test("400: inc_votes is not an integer", () => {
    const update = { inc_votes: 5.5 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("inc_votes is not an integer");
      });
  });
  test("404: valid but non-existent article_id (article doesn't exist)", () => {
    const update = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1111")
      .send(update)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article not found.");
      });
  });
});

describe("DELETE:/api/comments/:comment_id", () => {
  test("204: deletes the comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
        expect(response.res.statusMessage).toBe("No Content");
      });
  });
  test("400: invalid comment id", () => {
    return request(app)
      .delete("/api/comments/one")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request.");
      });
  });
  test("404: valid but non-existent comment id", () => {
    return request(app)
      .delete("/api/comments/1111111")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Comment not found.");
      });
  });
});

describe("GET: /api/users", () => {
  test("200: sends an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBeGreaterThan(0);
        response.body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
  test("404: endpoint that does not exist", () => {
    return request(app).get("/api/unknownendpoint").expect(404);
  });
});
