const mongoose = require("mongoose");

const url= process.env.MONGO_CONN

mongoose.connect(url).then(()=>{
    console.log("mongoDB server connented....");
}).catch((error)=>{
    console.log(`mongoDB server connection ${error}`);
})

