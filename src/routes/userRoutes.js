const express = require("express");
const {
  createUser,
  getSingleUser,
  getAllUsers,
  updateSingleUser,
  deleteSingleUser,
  userLogin,
} = require("../controllers/userController");
const { verifyUserLogin, RestrictTo } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", userLogin);
router
  .get("/:id", verifyUserLogin, RestrictTo(["admin"]), getSingleUser)
  .patch("/:id", verifyUserLogin, RestrictTo(["admin"]), updateSingleUser)
  .delete("/:id", verifyUserLogin, RestrictTo(["admin"]), deleteSingleUser);
router.get("/", verifyUserLogin, RestrictTo(["admin"]), getAllUsers);

module.exports = router;
