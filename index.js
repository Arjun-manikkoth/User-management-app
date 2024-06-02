require('dotenv').config()
const mongoose = require("mongoose");
mongoose.connect(process.env.URL);
//-------------------------------

const express=require("express");
const app=express();

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

//for admin routes
app.use("/admin",adminRoute);

//for user routes
app.use("/",userRoute);

app.listen(3001,()=>{
  console.log("listening to the port")
})