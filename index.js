const express = require("express"); 
const connectDB = require("./config/db");
const configapp = require("./config");

const log = configapp.logger;

const app = express(); 



app.use(express.json({ extended : false}));

//connected to db.
connectDB();

//get router files
const indexRouter = require("./routes/index");
const urlRouter = require("./routes/url");

//use routes

app.use("/", indexRouter);
app.use("/api/url", urlRouter);

const PORT = process.env.PORT || 3000;
  
app.listen(PORT, "localhost",() => log.info(`successfully started, listening on port ${PORT}`));