const authMiddleware = (req, res, next) => {
   
    req.user = {
      id: '86b0fb25-e1f7-41a1-8338-fee52ca2669d', 
      name: 'Uvindu Dev'
    };
    next();
  };
  
  module.exports = authMiddleware;