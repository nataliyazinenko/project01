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
  test("documents available endpoints", () => {
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
        expect(response.body.article).toHaveProperty("body");
        expect(response.body.article).toHaveProperty("topic");
        expect(response.body.article).toHaveProperty("created_at");
        expect(response.body.article).toHaveProperty("votes");
        expect(response.body.article).toHaveProperty("article_img_url");
      });
  });
  ("");
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
  test("404: missing article id", () => {
    return request(app).get("/api/articles/").expect(404);
  });
});
