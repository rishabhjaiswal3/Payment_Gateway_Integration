const PaymentConfig = {
    STRIPE: {
        SECRET_KEY: process.env.STRIPE_SECRET_KEY
    },
    RAZORPAY: {
        API_KEY:  process.env.RAZORPAY_API_KEY,
        SECRET_KEY: process.env.RAZORPAY_SECRET_KEY
    }
}

module.exports = { PaymentConfig };