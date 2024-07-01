const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const ReviewController=require("../controllers/reviews.js");

// Review Create route
router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.createReview));

// Review Delete route
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.destroyReview));

module.exports=router;