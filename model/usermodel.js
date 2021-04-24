const mongoose = require("mongoose");
const Joi = require("joi");
const randStr = require("randomstring");
const User = mongoose.model(
  "tblUsers",
  new mongoose.Schema({
    title: { type: String, required: true },
    fullName: { type: String, required: true, uppercase: true },
    homeAddress: { type: String, required: true, uppercase: true },
    phone: { type: String, required: true, min: 10, max: 15 },
    dateOfBirth: { type: String, required: true, min: 10, max: 15 },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6, maxlength: 15 },
    dataAdded: { type: "date", default: Date.now },
    isActive: { type: Boolean, default: true },
    Role: { type: String, required: true },
  })
);

function validateUser(user) {
  const Schema = {
    title: Joi.string().max(5).required(),
    fullName: Joi.string().required(),
    homeAddress: Joi.string().max(50).required(),
    phone: Joi.string().max(17).min(11).required(),
    dateOfBirth: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).max(15).required(),
    Role: Joi.string().required()
  };
  return Joi.validate(user, Schema);
}
 async function LogMeIn(request, resp) {
   try {
     console.log("nmnbbmb  "+ request.body.email);
     console.log(request.body.password);
     let retLogin = await User.findOne({
       email: request.body.email.trim(),
       password: request.body.password.trim(),
     });
     console.log(retLogin);
     if (retLogin != null) return resp.status(200).send(retLogin);
     return resp.status(400).send("Invalid userName or passwords");
   } catch (ex) {
     console.log(ex);
     return resp.status(400).send("Invalid userName or passwords");
   }
 }

async function CheckAndCreateNewUser(request, resp) {
  try {
    let validateReq = await validateUser(request.body);
    if (validateReq.error)
      return resp.status(400).send(validateReq.error.details[0].message);
  } catch (ex) {
    console.log(ex);
  }
  try {
    //check Email does not exist before
    let retUser = await User.findOne({ email: request.body.email }); //.pretty();
    if (retUser != null) {
      return resp.status(400).send("Email already exists");
    }
  } catch (ex) {
    console.log(ex);
  }

  try {
    const createNew = await CreateUser(request.body);
    if (createNew != null) {
      return resp
        .status(200)
        .send(`New user with record id ${createNew} was created successfully`);
    }
    return resp.status(400).send("Unable to create user at the moment");
  } catch (ex) {
    console.log(ex);
  }
}
async function getUserByEmail(request, response){
  try {
    //check Email does not exist before
    let retUser = await User.findOne({ email: request.body.email }); //.pretty();
    if (retUser != null) {
    return response.send(retUser);
    }
    return response.status(400).send("record does not exist.");
  } catch (ex) {
    console.log(ex);
  }
}

 async function UpdatePassword(req, resp) {
   let yourString = randStr.generate(8);
   const updateRec = await User.updateOne(
     { email: req.params.email.trim() },
     { $set: { password: yourString } },
     { upsert: true }
   );
   if (updateRec) return resp.status(200).send(`password updated successfully your new password is ${yourString}`);
   return resp
     .status(400)
     .send("Unable to update recover password at the moment");
 }

async function CreateUser(reqBody) {
  const newUser = new User({
    title: reqBody.title,
    fullName: reqBody.fullName,
    homeAddress: reqBody.homeAddress,
    phone: reqBody.phone,
    dateOfBirth: reqBody.dateOfBirth,
    email: reqBody.email,
    password: reqBody.password,
    dataAdded: Date.now(),
    isActive: true,
    Role: reqBody.Role,
  });
  const saveRec = await newUser.save();
  return saveRec._id;
}

module.exports.CheckAndCreateNewUser = CheckAndCreateNewUser;
exports.LogMeIn = LogMeIn;
exports.UpdatePassword = UpdatePassword;
exports.getUserByEmail = getUserByEmail;