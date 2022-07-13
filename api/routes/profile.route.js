const express = require("express");
const router = express.Router();
const profilesController = require("../controllers/profile.controller");
const authController = require("../controllers/auth.controller");

// 0. Get all records from the dataset.
router.get("/", authController.verify(), (req, res) => {
  profilesController.getAllProfiles(req, res);
});

// 1. Add a new record to the dataset.
router.post("/", authController.verify(), (req, res) => {
  profilesController.addProfile(req, res);
});

// 2. Delete a record from the dataset.
router.delete("/(:name)", authController.verify(), (req, res) => {
  profilesController.deleteProfileByName(req, res);
});

module.exports = router;
