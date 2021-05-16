const mongoose = require("mongoose");
const Joi = require("joi");
const usermodel = require("../model/usermodel");
//mongoose to create entity
const myorder = mongoose.model(
  "tblorders",
  new mongoose.Schema({
    userEmail: { type: String, required: true },
    contactNumber: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    productName: { type: String, required: true},
    productImageLink: { type: String, required: true },
    productPrice: { type: String, required: true},
    orderDate:{ type: "date", default: Date.now() },
    nameOnCard: { type: String, required: true},
    paymentType:{ type: String, required: true , default:"card"},
    cardNumber:{ type: String, required: true },
    expiryDate:{ type: String, required: true },
    cvv:{ type: String, required: true },
    myLocation:{ type: String, required: true },
    status: { type: String, required: true, default:"Active" },
  })
);
//validate request using Joi
function validateOrder(order) {
  const Schema = {
    nameOnCard: Joi.string().required(),
    userEmail: Joi.string().required(),
    contactNumber: Joi.string().required(),
    deliveryAddress: Joi.string().required(),
    productName: Joi.string().required(),
    productImageLink: Joi.string().required(),
    productPrice: Joi.string().required(),
    cardNumber: Joi.string().required(),
    expiryDate: Joi.string().required(),
    cvv: Joi.string().required(),
    myLocation: Joi.string().required()
  };
  return Joi.validate(order, Schema);
}
//validate request and create user
async function CheckAndCreateNewOrder(request, resp) {
  try {
      console.log(request.body);
      let validateReq = await validateOrder(request.body);
      if (validateReq.error) return resp.status(400).send(validateReq.error);
    } catch (ex) {
        console.log(ex);
    }
  try {
    //check Email does not exist before
    if (usermodel.getUserByEmail(request.body.userEmail)==null){
        return resp.status(400).send("User does not exist, Please request via our mobile app.");
    } 
  } catch (ex) {
    console.log(ex);
  }

  try {
    const createNew = await placeOrder(request.body);
    if (createNew != null) {
      return resp.send(`New product with record id ${createNew} was created successfully`);
    }
    return resp.status(400).send("Unable to create product at the moment");
  } catch (ex) {
    console.log(ex);
  }
}
//create 
async function placeOrder(reqBody) {
  const newUser = new myorder({
    nameOnCard: reqBody.nameOnCard,
    userEmail: reqBody.userEmail,
    contactNumber: reqBody.contactNumber,
    deliveryAddress: reqBody.deliveryAddress,
    productName: reqBody.productName,
    productImageLink: reqBody.productImageLink,
    productPrice: reqBody.productPrice,
    orderDate: Date.now(),
    cardNumber: reqBody.cardNumber,
    expiryDate: reqBody.expiryDate,
    cvv: reqBody.cvv,
    myLocation: reqBody.myLocation,
    status: "Submitted"
  });
  const saveRec = await newUser.save();
  return saveRec._id;
}
//export end point
module.exports.CheckAndCreateNewOrder = CheckAndCreateNewOrder;

