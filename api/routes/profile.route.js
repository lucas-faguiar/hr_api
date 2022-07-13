const express = require("express");
const router = express.Router();
const profilesController = require("../controllers/profile.controller");

// 0. Get all records from the dataset.
router.get("/", (req, res) => {
  profilesController.getAllProfiles(req, res);
});

// 1. Add a new record to the dataset.
router.post("/", (req, res) => {
  profilesController.addProfile(req, res);
});

// 2. Delete a record from the dataset.
router.delete("/(:name)", (req, res) => {
  profilesController.deleteProfileByName(req, res);
});

module.exports = router;
