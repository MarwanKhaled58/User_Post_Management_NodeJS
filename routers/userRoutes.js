const express = require("express");
const userController = require("./../controllers/userController");
const auth = require("./../middlewares/auth");
const restrictTo = require("./../middlewares/restrictTo");
const router = express.Router();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get("/",auth, userController.getAllUsers);

router.get("/:id",auth, userController.getOneUser);

router.patch("/:id",auth, userController.updateUser);

router.delete("/:id",auth, userController.deleteUser);

module.exports = router;
