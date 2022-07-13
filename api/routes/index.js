const profiles = require("./profiles.route");
const statistics = require("./statistics.route");

module.exports = (app) => {
  app.use("/api/v1/profiles", profiles);
  app.use("/api/v1/statistics", statistics);
};
