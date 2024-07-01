const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// INDEX PAGE
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

// NEW PAGE
module.exports.newListing=(req,res)=>{
    res.render("listings/new.ejs");
}

// CREATE PAGE
module.exports.createListing=async (req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      }).send();

    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
    let newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};

    newlisting.geometry=response.body.features[0].geometry;
    let ans=await newlisting.save();
    console.log(ans);
    req.flash("success","New listing created..!");
    res.redirect("/listings");
}

// SHOW PAGE
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    req.session.redirectUrl=req.originalUrl;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    let response=await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1
      }).send();
    listing.geometry=response.body.features[0].geometry;
    if(!listing){
       req.flash("error","Listing you requested for does not exist..!");
       res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

// EDIT PAGE
module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you requested for does not exist..!");
       res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

// UPDATE PAGE
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated..!");
    res.redirect(`/listings/${id}`);
}

// DELETE PAGE
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted..!");
    res.redirect("/listings");
}