import Razorpay from 'razorpay';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_U55Trtrut503Is';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'EVFvGZyVpOM2JlGlrabxSM8i';

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = body || {};

    // Validate amount
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount < 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Amount',
        message: 'Order amount must be at least 100 paise (₹1.00).',
      });
    }

    const options = {
      amount: parsedAmount,
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.error?.description || error.message || 'Failed to create Razorpay order',
    });
  }
}
