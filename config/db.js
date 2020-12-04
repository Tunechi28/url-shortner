const mongoose = require("mongoose");
const config = require("config")
const db = config.get("mongoURI");
const configapp = require("../config");

const log = configapp.logger;

const connectDB = async () =>  {
    try{
        mongoose.connect(db, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        })

        log.info("connected to mongo db");

    }catch(err){
        log.warn(err.message);
    }
} 

module.exports = connectDB;