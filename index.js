const _ = require("underscore");
const express  = require("express");
const http = require("http");
const mongoose = require("mongoose");
const orderroute = require("./routes/orderroute");
const products = require("./routes/productroute");
const user= require("./routes/userroute");

const app = express();
app.use(express.json());//this will allow our service to be able to see/use body request as json

//endpoints 
app.use("/api/products",products);
app.use("/api/user",user);
app.use("/api/order",orderroute);


//configure the port 
const appPort = process.env.PORT || 3008;
var mongodb=   mongoose.connection;
mongoose.connect("mongodb+srv://chickenbox:4r0Nm0WAZyslQ9yd@cluster0.nipgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{ useNewUrlParser: true })
    .then(()=> console.log('connected'))
    .catch(err => console.error('could not connect',err));

mongodb.on("error", console.error.bind(console,"mongo db connection error"));
mongodb.once("open", function callback(){
    console.log("mongodb+srv://chickenbox:4r0Nm0WAZyslQ9yd@cluster0.nipgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" + "mongodb opened")
})
app.listen(appPort); //4r0Nm0WAZyslQ9yd    chickenbox