const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();
const API_KEY =  'ADD_API_KEY_HERE';
const SECRET_KEY = 'ADD_API_SECRET_HERE';

router.post("/order", async (req, res) => {
    try {
        console.log("req.body is",req.body);
        const amount = req.body?.amount;
        const instance = new Razorpay({
            key_id: API_KEY,
            key_secret: SECRET_KEY,
        });

        const options = {
            amount: amount, // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;