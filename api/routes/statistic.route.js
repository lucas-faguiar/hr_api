const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statistic.controller");
const authController = require("../controllers/auth.controller");

// 3, 4, 5, 6. Get salary statistics.
router.get("/", authController.verify(10), (req, res) => {
  statisticsController.getStatistics(req, res);
});

module.exports = router;
