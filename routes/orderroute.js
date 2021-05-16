const express = require("express");
const router = express.Router();
const {CheckAndCreateNewOrder} = require("../model/ordermodel");
router.post("/placeOrder", CheckAndCreateNewOrder);

module.exports = router;
//order endpoint 