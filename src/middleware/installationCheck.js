const fs = require('fs');

const checkInstallation = (req, res, next) => {
  const isInstalled = fs.existsSync('.env') && fs.existsSync('installed.txt');

  if (!isInstalled) {
    // If the application is not installed, render a specific page
    return res.render('installation/index', { layout: setupLayout });
  }

  // Continue to the next middleware or route handler
  next();
};

module.exports = checkInstallation;
