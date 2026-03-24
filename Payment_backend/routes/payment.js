const express = require("express");
const uuidv4 = require("uuid").v4;
const { PaymentConfig } = require("../constants/payment");
const Razorpay = require("razorpay");
const Stripe = require("stripe");

const router = express.Router();
const stripe = Stripe(PaymentConfig.STRIPE.SECRET_KEY);

router.post("/order", async (req, res) => {
    const { API_KEY, SECRET_KEY } = PaymentConfig.RAZORPAY;

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

router.post("/create-payment-intent", async (req, res) => {
    try {
        const { item } = req.body;
        const { price } = item;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price * 100, 
            currency: "inr",
            automatic_payment_methods: { enabled: true },
        });

        const intentId = uuidv4();
        res.json({ intentId, item, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.log("Error in creating payment intent", error);
        res.status(500).json({ error: "Failed to create payment intent" });
    }
});

module.exports = router;