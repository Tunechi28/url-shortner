const bunyan = require("bunyan");
const appname = "url-shortner";

module.exports ={
    applicationname : appname,
    logger : bunyan.createLogger( {name : "appname"})
};