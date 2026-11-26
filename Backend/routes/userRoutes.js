const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getAllUsers , getMe , getUserById} = require("../controllers/usersController");

router.get("/me", protect, getMe);   
router.get("/:id", protect, getUserById);
router.get("/", protect, getAllUsers);

module.exports = router;