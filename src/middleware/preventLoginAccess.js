const preventLoginAccess = (req, res, next) => {
    const token = req.cookies.token;
  
    if (token) {
      return res.redirect('/admin'); 
    }
  
    next();
  };
  
  module.exports = preventLoginAccess;
  