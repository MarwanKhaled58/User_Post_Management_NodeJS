const express=require("express");
const postController=require("./../controllers/postsController");
const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");

const router=express.Router();


router.post("/",auth,postController.createpost);

router.get("/",auth, restrictTo("admin"),postController.getAllPosts);

router.get("/:id",auth,postController.getPostById);

router.patch("/:id",auth,postController.updatePostById);

router.delete("/:id",auth,postController.deletePostById);

module.exports=router;
