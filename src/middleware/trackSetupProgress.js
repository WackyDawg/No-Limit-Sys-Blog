const fs = require('fs');

const trackSetupProgress = (step) => {
  const stepFilePath = 'step.txt'; // Replace with the actual file reference

  try {
    fs.writeFileSync(stepFilePath, step.toString(), 'utf-8');
    console.log(`Setup progress updated to Step ${step}`);
  } catch (error) {
    console.error('Error updating setup progress:', error.message);
  }
};

module.exports = trackSetupProgress;
