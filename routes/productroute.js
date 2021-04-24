const express = require("express");
const router = express.Router();
const {CheckAndCreateNewProduct} = require("../model/productmodel");
router.post("/createProduct", CheckAndCreateNewProduct);

module.exports = router;