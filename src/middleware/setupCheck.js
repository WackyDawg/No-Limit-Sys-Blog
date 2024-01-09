const fs = require('fs');

const setupCheckMiddleware = (req, res, next) => {
  const isInstalled = fs.existsSync('.env') && fs.existsSync('installed.txt');

  if (isInstalled) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = setupCheckMiddleware;
