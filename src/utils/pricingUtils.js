/**
 * Utility functions for pricing calculations
 */

/**
 * Calculate price based on seat count
 * @param {number} seatCount - Number of seats
 * @returns {number} - Calculated price
 */
const calculatePriceBySeatCount = (seatCount) => {
    if (seatCount === 1) return 50;
    if (seatCount === 2) return 100;
    if (seatCount === 3) return 150;
    if (seatCount === 4) return 200;
    return 250; // 5+ seats
  };
  
  /**
   * Get PayHere payment link by price
   * @param {number} price - Calculated price
   * @returns {string} - PayHere payment link
   */
  const getPaymentLinkByPrice = (price) => {
    const paymentLinks = {
      50: 'https://sandbox.payhere.lk/pay/oeca38ae',
      100: 'https://sandbox.payhere.lk/pay/oad887c7e',
      150: 'https://sandbox.payhere.lk/pay/oda8f4ce8',
      200: 'https://sandbox.payhere.lk/pay/o43861d52',
      250: 'https://sandbox.payhere.lk/pay/o34812dc4'
    };
    
    return paymentLinks[price] || paymentLinks[250]; // Default to highest price if not found
  };
  
  module.exports = {
    calculatePriceBySeatCount,
    getPaymentLinkByPrice
  };