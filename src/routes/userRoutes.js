const express = require("express");
const {
  createUser,
  getSingleUser,
  getAllUsers,
  updateSingleUser,
  deleteSingleUser,
  userLogin,
} = require("../controllers/userController");
const { verifyUserLogin } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", userLogin);
router
  .get("/:id", verifyUserLogin, getSingleUser)
  .patch("/:id", verifyUserLogin, updateSingleUser)
  .delete("/:id", verifyUserLogin, deleteSingleUser);
router.get("/", verifyUserLogin, getAllUsers);

module.exports = router;
