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

  //check for the validity of the long url submitted

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

//to change the system generated shorturl using custom urlcode
//enter any code to generate a domain

router.put("/short", async (req, res) => {
    try{
       const { shortUrl } = req.body;
       const { newUrlCode } = req.body;
       const baseUrl = config.get("baseUrl");
       const newshortUrl = baseUrl + "/" + newUrlCode;
        const url = await Url.findOne({ shortUrl });
        if(url){
            const testUrl = await Url.findOne({shortUrl : newshortUrl});
            if(testUrl){
                return res.json("this code is already in use");
            }else{
                url.urlCode = newUrlCode;
                url.shortUrl = newshortUrl;
                await url.save();
                return res.json(url);
            }
        }else{
            return res.json("the short url doesnt exist");
        }

    }catch(err){
        log.warn(err);
        res.status(500).json("server error");
    }
})

module.exports = router;