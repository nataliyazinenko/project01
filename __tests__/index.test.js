const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../db/app");
const request = require("supertest");

// const seed = importedFromDBSeed.seed;

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("get 200, sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBeGreaterThan(0); /// this will test that returned array is not empty
        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});
