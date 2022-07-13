const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statistics.controller");

// 3, 4, 5, 6. Get salary statistics.
router.get("/", (req, res) => {
  statisticsController.getStatistics(req, res);
});

module.exports = router;
