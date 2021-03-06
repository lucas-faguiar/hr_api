
const auth = require("./auth.route");
const profiles = require("./profile.route");
const statistics = require("./statistic.route");

module.exports = (app) => {
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/profiles", profiles);
  app.use("/api/v1/statistics", statistics);
};
