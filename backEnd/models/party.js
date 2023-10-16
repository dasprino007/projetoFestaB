const mongoose = require("mongoose")

const PartySchema = new mongoose({
    title : {
        type: string,
        required : true
    },
    description : {
        type : string
    },
    PartyDate:{
        type : Date
    },
    photos:{
        type: Array
    },
    privacy:{
        type: Boolean
    },
    userId:{
        type: mongoose.ObjetcId
    }
})