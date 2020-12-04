const Logger = require("bunyan");
const express = require("express");
const configapp = require("../config")
const Url = require("../models/Url")

const log = configapp.logger;
const router = express.Router();

router.get("/:code", async (req,res) => {
    try{
        const url = await Url.findOne({urlCode : req.params.code});
        if(url){
            return res.redirect(url.longUrl);
        }else{
            return res.status(401).json("url not found")
        }

    }catch(err){
        log.warn(err)
        return res.status(500).json("server error")
        
    }
    
})

module.exports = router;