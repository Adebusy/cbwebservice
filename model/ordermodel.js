const mongoose = require("mongoose");
const Joi = require("joi");
const usermodel = require("../model/usermodel");
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
    paymentType:{ type: String, required: true },
    status: { type: String, required: true, default:"Active" },
  })
);

function validateOrder(order) {
  const Schema = {
    userEmail: Joi.string().required(),
    contactNumber: Joi.string().required(),
    deliveryAddress: Joi.string().required(),
    productName: Joi.string().required(),
    productImageLink: Joi.string().required(),
    productPrice: Joi.string().required(),
    paymentType: Joi.string().required(),
  };
  return Joi.validate(order, Schema);
}
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

async function placeOrder(reqBody) {
  const newUser = new myorder({
    userEmail: reqBody.userEmail,
    contactNumber: reqBody.contactNumber,
    deliveryAddress: reqBody.deliveryAddress,
    productName: reqBody.productName,
    productImageLink: reqBody.productImageLink,
    productPrice: reqBody.productPrice,
    orderDate: Date.now(),
    paymentType:reqBody.paymentType,
    status: "Submitted"
  });
  const saveRec = await newUser.save();
  return saveRec._id;
}

module.exports.CheckAndCreateNewOrder = CheckAndCreateNewOrder;

