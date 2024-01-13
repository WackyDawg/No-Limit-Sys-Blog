const express = require('express');
const fs = require('fs').promises; // Use the promises version of fs
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public')); // Serve static files from the public directory

app.get('/', async (req, res) => {
  try {
    const envFilePath = path.join(__dirname, '.env');
    const publicFolderPath = path.join(__dirname, 'public');

    // Get file stats (including permissions)
    const envFileStats = await fs.stat(envFilePath);
    const publicFolderStats = await fs.stat(publicFolderPath);

    // Extract permissions from stats
    const envFilePermissions = envFileStats.mode.toString(8).slice(-3);
    const publicFolderPermissions = publicFolderStats.mode.toString(8).slice(-3);

    // Render the EJS template with the permissions data
    res.render('index', {
      envFilePermissions,
      publicFolderPermissions,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
