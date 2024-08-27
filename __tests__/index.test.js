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
  test("200: sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBeGreaterThan(0);
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
        response.body.articles.forEach((article) => {
          expect(article).toHaveProperty("comment_count");
        });
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
