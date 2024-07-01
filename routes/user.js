const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController=require("../controllers/users.js");

// Sign Up Route
router.route("/signup").get(UserController.renderSignup).post(wrapAsync(UserController.signup));

// Login Route
router.route("/login").get(UserController.renderLogin).post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),UserController.login);

// Logout Route
router.get("/logout",UserController.logout);

module.exports=router;