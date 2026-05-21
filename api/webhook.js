// Stripe webhook endpoint for AI Organizer purchases
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { provisionLicense } = require('./browsx-provision');

// Disable body parsing for raw body access
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

// Helper to get raw body
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Get raw body for signature verification
    const rawBody = await getRawBody(req);

    // Verify webhook signature
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;
    const amount = session.amount_total;

    // Determine tier based on amount (in cents) - handle $0 for free/coupon purchases
    let tier;
    if (amount === 9700) tier = 'standard';      // $97
    else if (amount === 19700) tier = 'enhanced'; // $197
    else if (amount === 29700) tier = 'ultimate'; // $297
    else if (amount === 0) tier = 'standard';    // Free/coupon purchases
    else tier = 'standard'; // default

    console.log(`Payment received: ${customerEmail} - ${tier} ($${amount/100})`);

    // Trigger Browsx provisioning
    try {
      const result = await provisionLicense(customerEmail, tier);
      console.log('Browsx provisioning result:', JSON.stringify(result));
      
      // Return success
      return res.status(200).json({ 
        received: true, 
        provisioned: true,
        email: customerEmail,
        tier: tier
      });
    } catch (error) {
      console.error('Browsx provisioning failed:', error.message);
      // Return 200 so Stripe doesn't retry, but log error
      return res.status(200).json({ 
        received: true, 
        provisioned: false,
        error: error.message 
      });
    }
  }

  // Return 200 to acknowledge receipt for other event types
  res.status(200).json({ received: true });
};
