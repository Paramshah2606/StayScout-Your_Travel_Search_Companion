const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

const Mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to db..");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_url);
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"667a5d2929ebce5f8aa8005c",geometry:{ type: 'Point', coordinates: [ 72.579498, 23.02318 ] }}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized..");
}

initDB();