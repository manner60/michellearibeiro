// Stripe webhook endpoint for AI Organizer purchases
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { provisionLicense } = require('./browsx-provision');
const { storeLicense } = require('./license-store');
const { createContact } = require('./gc-client');

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
    const customerName = session.customer_details?.name || '';
    const amount = session.amount_total;

    // Determine tier based on amount (in cents) - handle $0 for free/coupon purchases
    let tier;
    if (amount === 9700) tier = 'standard';      // $97
    else if (amount === 19700) tier = 'enhanced'; // $197
    else if (amount === 29700) tier = 'ultimate'; // $297
    else if (amount === 0) tier = 'standard';    // Free/coupon purchases
    else tier = 'standard'; // default

    console.log(`Payment received: ${customerEmail} - ${tier} ($${amount/100})`);
    console.log(`Env vars check: BROWSX_USER=${process.env.BROWSX_USER ? 'set' : 'missing'}, BROWSX_PASS=${process.env.BROWSX_PASS ? 'set' : 'missing'}`);

    // Create contact in GC
    let gcResult;
    try {
      const gcApiKey = process.env.GC_API_KEY;
      if (gcApiKey) {
        // Map tier to your existing GC tags
        const tierTagMap = {
          'standard': 'aio-std',
          'enhanced': 'aio-enh',
          'ultimate': 'aio-ult'
        };
        const tierTag = tierTagMap[tier] || 'aio-std';
        
        gcResult = await createContact(customerEmail, customerName, gcApiKey, [
          tierTag,
          'ai-organizer-2026',
          'michelle-referral'
        ]);
        console.log('GC contact created:', JSON.stringify(gcResult));
      } else {
        console.log('GC_API_KEY not set, skipping GC contact creation');
      }
    } catch (gcError) {
      console.error('GC contact creation failed:', gcError.message);
      // Don't fail the webhook if GC fails
    }

    // Trigger Browsx provisioning
    try {
      const result = await provisionLicense(customerEmail, tier);
      console.log('Browsx provisioning result:', JSON.stringify(result));
      
      // Store license key with customer name
      const licenseKey = result.data?.license_key;
      if (licenseKey) {
        storeLicense(customerEmail, {
          licenseKey: licenseKey,
          tier: tier,
          amount: amount,
          name: customerName
        });
        console.log(`License stored for ${customerName} (${customerEmail}): ${licenseKey}`);
      }
      
      // Return success with license info
      return res.status(200).json({ 
        received: true, 
        provisioned: true,
        gcCreated: !!gcResult?.contact?.id,
        email: customerEmail,
        tier: tier,
        license: licenseKey || 'generated'
      });
    } catch (error) {
      console.error('Browsx provisioning failed:', error.message);
      console.error('Stack:', error.stack);
      // Return 200 so Stripe doesn't retry, but include error info
      return res.status(200).json({ 
        received: true, 
        provisioned: false,
        gcCreated: !!gcResult?.contact?.id,
        error: error.message 
      });
    }
  }

  // Return 200 to acknowledge receipt for other event types
  res.status(200).json({ received: true });
};
