const express = require("express");
const config = require("config");
const configapp = require("../config")
const validUrl = require("valid-url");
const shortid = require("shortid");
const mongoose = require("mongoose");
const Url =require("../models/Url");

const router = express.Router();
const log = configapp.logger;

//to submit a long url
router.post("/short", async (req,res) => {
  const  { longUrl } = req.body;
  const baseUrl = config.get("baseUrl");

  if(!validUrl.isUri(baseUrl)){
      res.status(401).json("not a valid base url");
  }

  const urlCode = shortid.generate();

  //check for the validity of the long url sumbilitted

  if(validUrl.isUri(longUrl)){
    try {
        let url = await Url.findOne({longUrl});

        if(url) {
            res.json(url);
        }else{
            const shortUrl = baseUrl + "/" + urlCode;
            url = new Url({
                shortUrl,
                longUrl,
                urlCode
            }); 
           await url.save();
           res.json(url);
        }
        
    } catch (err) {
        log.warn(err);
        res.status(500).json("server error");
    }

  }else{
      res.status(401).json("not a valid long url");

  }

})

module.exports = router;