import crypto from 'crypto';

const key_secret = process.env.RAZORPAY_KEY_SECRET || 'EVFvGZyVpOM2JlGlrabxSM8i';

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

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      error: 'Missing required payment verification fields',
      message: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.',
    });
  }

  try {
    const dataToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(dataToSign)
      .digest('hex');

    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(razorpay_signature, 'utf-8')
    );

    if (isAuthentic) {
      return res.status(200).json({
        success: true,
        message: 'Payment signature verified successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid Signature',
        message: 'Payment verification failed: Signature mismatch',
      });
    }
  } catch (error: any) {
    console.error('Signature verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Verification Error',
      message: error.message || 'Internal server error verifying signature',
    });
  }
}
