import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe once outside the component so it's not recreated on re-renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ── Step 2: Checkout form — rendered inside <Elements> ──────────────────────
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return; // Stripe.js not yet loaded

    setIsProcessing(true);
    setMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirect here after 3D Secure or bank redirect flows
        return_url: `${window.location.origin}/payment-success`,
      },
      // Prevent redirect if payment completes without extra steps
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent?.status === 'succeeded') {
      setMessage('Payment successful! Thank you for your purchase.');
    } else {
      setMessage('Unexpected payment status. Please contact support.');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stripe's unified payment UI — card, Apple Pay, Google Pay, etc. */}
      <PaymentElement />

      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing…' : 'Pay ₹20'}
      </button>

      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
    </form>
  );
}

// ── Step 1: Fetch clientSecret, then mount Elements provider ────────────────
const StripeGateway = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Create a PaymentIntent on the backend as soon as the component mounts
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/payment/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: { id: 'prod_001', price: 2000 } }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("my data is ",data);
        if (data.clientSecret) {``
          setClientSecret(data.clientSecret);
        } else {
          setError('Failed to initialize payment.');
        }
      })
      .catch(() => setError('Could not connect to payment server.'));
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!clientSecret) return <p>Loading payment form…</p>;

  return (
    // Elements must wrap any component that uses useStripe / useElements
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeGateway;
