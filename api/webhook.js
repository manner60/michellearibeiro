// Stripe webhook endpoint for AI Organizer purchases
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;
    const amount = session.amount_total;
    
    // Determine tier based on amount (in cents)
    let tier;
    if (amount === 9700 || amount === 9700) tier = 'standard';      // $97
    else if (amount === 19700 || amount === 19700) tier = 'enhanced'; // $197
    else if (amount === 29700 || amount === 29700) tier = 'ultimate'; // $297
    else tier = 'standard'; // default
    
    console.log(`Payment received: ${customerEmail} - ${tier}`);
    
    // Trigger Browsx provisioning
    try {
      const { stdout, stderr } = await execAsync(
        `python3 /root/.openclaw/workspace/browsx_provision_ai_organizer.py "${customerEmail}" "${tier}"`,
        {
          env: {
            ...process.env,
            BROWSX_USER: process.env.BROWSX_USER,
            BROWSX_PASS: process.env.BROWSX_PASS
          },
          timeout: 30000
        }
      );
      
      console.log('Browsx provisioning result:', stdout);
      if (stderr) console.error('Browsx stderr:', stderr);
      
    } catch (error) {
      console.error('Browsx provisioning failed:', error);
      // Don't fail the webhook - Stripe will retry
    }
  }
  
  // Return 200 to acknowledge receipt
  res.status(200).json({ received: true });
};
