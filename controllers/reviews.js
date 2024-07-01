const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async (req,res)=>{
    let newreview=new Review(req.body.review);
    let listing=await Listing.findById(req.params.id);
    newreview.author=req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    console.log("New review saved..");
    req.flash("success","New review created..!");
    res.redirect(`/listings/${listing.id}`);
}

module.exports.destroyReview=async (req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    console.log("Delete working");
    req.flash("success","Review deleted..!");
    res.redirect(`/listings/${id}`);
}