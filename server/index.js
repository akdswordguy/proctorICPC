const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { mergeChunks } = require('./merge');

const app = express();
const PORT = 5000;
app.use(cors());

// Ensure upload directories exist
['video', 'audio', 'screen'].forEach(type => {
  fs.mkdirSync(path.join(__dirname, 'uploads', type), { recursive: true });
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    let type = 'other';
    if (file.originalname.startsWith('video-')) type = 'video';
    else if (file.originalname.startsWith('audio-')) type = 'audio';
    else if (file.originalname.startsWith('screen-')) type = 'screen';
    cb(null, path.join(__dirname, 'uploads', type));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  // Optionally, save metadata here
  res.status(200).json({ message: 'Chunk uploaded successfully' });
});

// Endpoint to merge all video chunks after exam ends
app.post('/merge', (req, res) => {
  // You can add logic to select which type to merge (video/audio/screen)
  mergeChunks('video', 'final_video.webm', (err, outPath) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Merged successfully', file: outPath });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
