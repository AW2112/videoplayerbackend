const express = require('express');
const multer = require('multer');
const cors = require('cors');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const app = express();
const port = 3000;

app.use(cors());

// Configure AWS
aws.config.update({
  accessKeyId: 'AKIARJKQCTFPFUMMTRUT',
  secretAccessKey: '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',
  region: 'Europe (Stockholm) eu-north-1',
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'videosstoragetest',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

app.post('/upload', upload.single('videoFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send('File uploaded successfully.');
});

app.get('/api/videos', (req, res) => {
  // You can still use the 'fs' module to read the list of files in the 'uploads' directory,
  // but it won't work as a storage mechanism for Vercel. Consider using a database or cloud storage.
  const fs = require('fs');
  const directoryPath = __dirname + '/uploads';

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading the directory.');
    }

    res.json(files);
  });
});

app.get('/', (req, res) => {
  res.send('hi');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
