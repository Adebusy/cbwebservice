const mongoose = require("mongoose");
const Joi = require("joi");
const Product = mongoose.model(
  "tblProducts",
  new mongoose.Schema({
    productImageLink: { type: String, required: true },
    productName: { type: String, required: true},
    productPrice: { type: String, required: true},
    status: { type: String, required: true, default:"Active" },
  })
);
function validateProduct(user) {
  const Schema = {
    productName: Joi.string().required(),
    productImageLink: Joi.string().required(),
    productPrice: Joi.string().required()
  };
  return Joi.validate(user, Schema);
}
async function CheckAndCreateNewProduct(request, resp) {
  try {
    let validateReq = await validateProduct(request.body);
    if (validateReq.error)
      return resp.status(400).send(validateReq.error.details[0].message);
  } catch (ex) {
    console.log(ex);
  }
  try {
    //check Email does not exist before
    let retUser = await Product.findOne({ productName: request.body.productName }); //.pretty();
    if (retUser != null) {
      return resp.status(400).send("product already exists");
    }
  } catch (ex) {
    console.log(ex);
  }

  try {
    const createNew = await CreateProduct(request.body);
    if (createNew != null) {
      return resp
        .status(200)
        .send(`New product with record id ${createNew} was created successfully`);
    }
    return resp.status(400).send("Unable to create product at the moment");
  } catch (ex) {
    console.log(ex);
  }
}

async function CreateProduct(reqBody) {
  const newUser = new Product({
    productImageLink: reqBody.productImageLink,
    productName: reqBody.productName,
    productPrice: reqBody.productPrice,
    status: reqBody.status,
  });
  const saveRec = await newUser.save();
  return saveRec._id;
}

async function ListProducts(req, resp) {
    try {
      let getprd = await Product.find();
      return resp.status(200).send(getprd);
    } catch (ex) {
      console.log(ex);
      return "Unable to fetch products at the moment, please try again later.";
    }
  }

module.exports.CheckAndCreateNewProduct = CheckAndCreateNewProduct;
module.exports.ListProducts= ListProducts;

