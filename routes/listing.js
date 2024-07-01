const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,validateListing,isOwner}=require("../middleware.js");
const ListingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })

// INDEX ROUTE, CREATE ROUTE
router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.createListing));
 
// NEW ROUTE
router.get("/new",isLoggedIn,ListingController.newListing);
 
// SHOW ROUTE , EDIT ROUTE, DELETE ROUTE
router.route("/:id").get(wrapAsync(ListingController.showListing)).put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.updateListing)).delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing));
 
// Edit ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.editListing));

module.exports=router;