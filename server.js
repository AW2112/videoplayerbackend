const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Serve uploaded files statically from the /uploads route
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('videoFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send('File uploaded successfully.');
});

app.get('/api/videos', (req, res) => {
    // Use the 'fs' module to read the list of files in the 'uploads' directory
    const fs = require('fs');
    const directoryPath = __dirname + '/uploads';
  
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).send('Error reading the directory.');
      }
  
      res.json(files);
    });
  });
  
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });