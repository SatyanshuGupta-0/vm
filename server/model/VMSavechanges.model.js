const mongoose = require("mongoose");

// const { create } = require("./VMUsermodel");

const saveChangeSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, 
    carModelId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "CarModel", 
        required: true 
    }, 
    color: {
        exterior: String,  
        interior: {
            seats: String,
            roof: String,
            dashboard: String
        },        headlightTint: String,
        windowTint: String,
    },
    alloy: {
        type: String,
    },
    tire :{
        type: String,
    },
    spoiler: {
        type: String,
    },
    headlight: {
        type: String,
    },
    footrest :{
        type: String,
    },
    backlight : {
        type:String,
    },
    roofrail:{
        type:String,
    },
    foglight:{
        type:String,
    },
    grill:{
        type:String,
    },
    Orvm:{
        type:String,
    },
    musicscreen:{
        type:String,
    },
    musicsystem:{
        type:String,
    },
    interiorlight:{
        type:String,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }

})

const saveChangeModel = mongoose.model("SaveChange", saveChangeSchema)

module.exports=saveChangeModel;