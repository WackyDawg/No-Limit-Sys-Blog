const express = require('express');
const router = express.Router();
const fs = require('fs')
const installController = require('../controller/installController');
const setupCheckMiddleware = require('../middleware/setupCheck');

const setupLayout  ='../views/layouts/setup';

// Setup routes go here

// router.get('/', (req, res) => {
//   const nodeVersion = process.version;
//   const isInstalled = fs.existsSync('.env') && fs.existsSync('installed.txt');

//   if (!isInstalled) {
//     // If the application is not installed, render a specific page
//     return res.render('not_installed');
//   }

//   // Proceed with your regular route handling
//   // For example, you can render your main application page
//   res.render('index');
// });

router.get('/step1', installController.Step1);
router.get('/step2', installController.Step2);
router.get('/step3', installController.Step3);
router.get('/step4', installController.Step4);
router.get('/step5', installController.Step5);
router.get('/system_setting', installController.systemSettings);


router.post('/setup/step3', installController.postStep3);
router.post('/setup/step4', installController.postStep4);
router.post('/setup/step5', installController.postStep5);

// Add other routes and corresponding controller functions

module.exports = router;
