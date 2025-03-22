// save as test-webhook.js
const axios = require('axios');
const crypto = require('crypto');

async function testPath(path) {
  try {
    const baseUrl = 'https://04ad-175-157-36-35.ngrok-free.app';
    const webhookUrl = `${baseUrl}${path}`;
    
    const payload = {
      merchant_id: "4OVxz3CLS9Q4JFnJQYjq6z3Xk",
      order_id: "ORD-92ca38f3-1742181663089",
      payment_id: "320032470777",
      payhere_amount: "250.00",
      payhere_currency: "LKR",
      status_code: "2",
      status_message: "Success",
      method: "VISA",
      card_holder_name: "Test User",
      card_no: "************1292",
      card_expiry: "12/25"
    };
    
    const merchantSecret = "4jtSpVtLlX28Rh1vNkbmWT49WjO2IMuNM8bQLZbXoexe";
    const stringToHash = `${payload.merchant_id}${payload.order_id}${payload.payhere_amount}${payload.payhere_currency}${payload.status_code}${merchantSecret}`;
    payload.md5sig = crypto.createHash('md5').update(stringToHash).digest('hex').toUpperCase();
    
    console.log(`Testing webhook at: ${webhookUrl}`);
    
    const response = await axios.post(webhookUrl, payload);
    console.log(`Response for ${path}:`, response.status, response.data);
    return true;
  } catch (error) {
    console.error(`Error for ${path}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function testAllPaths() {
  const paths = [
    '/api/payments/webhook',
    '/payments/webhook',
    '/webhook'
  ];
  
  for (const path of paths) {
    const result = await testPath(path);
    if (result) {
      console.log(`SUCCESS: Webhook works at ${path}`);
      break;
    }
  }
}

testAllPaths();