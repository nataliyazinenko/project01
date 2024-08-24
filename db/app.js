const express = require("express");
const { getAllTopics, getEndpointsDocumentation } = require("./controllers");

const app = express();

app.use(express.json());

app.get("/api", getEndpointsDocumentation);

app.get("/api/topics", getAllTopics);

module.exports = app;
