const { fetchTopics } = require("./models");

exports.getAllTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
