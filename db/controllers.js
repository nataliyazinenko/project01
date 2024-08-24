const { fetchTopics } = require("./models");
const fs = require("fs/promises");

exports.getAllTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpointsDocumentation = (req, res, next) => {
  fs.readFile("./endpoints.json", "utf-8")
    .then((contents) => {
      const parsedContents = JSON.parse(contents);
      res.status(200).send(parsedContents);
    })
    .catch((err) => {
      next(err);
    });
};
