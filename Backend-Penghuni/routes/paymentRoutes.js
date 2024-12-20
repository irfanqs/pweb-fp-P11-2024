// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { makePayment } = require("../controllers/paymentcontroller");
const { getPayments } = require("../controllers/paymentcontroller");


// Invoice endpoint
router.post("/pay", makePayment);
router.post("/get-history", getPayments);

module.exports = router;
