const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Helper to merge all .webm files in a folder into one using ffmpeg
function mergeChunks(type, outputName = 'output.webm', callback) {
  const dir = path.join(__dirname, 'uploads', type);
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.webm'))
    .map(f => path.join(dir, f));
  if (files.length === 0) return callback(new Error('No files to merge'));

  // Create a file list for ffmpeg
  const listPath = path.join(dir, 'files.txt');
  fs.writeFileSync(listPath, files.map(f => `file '${f.replace(/'/g, "'\\''")}'`).join('\n'));

  // ffmpeg command to concatenate
  const outPath = path.join(dir, outputName.replace('.webm', '.mp4'));
  const cmd = `ffmpeg -f concat -safe 0 -i "${listPath}" -c:v libx264 -c:a aac -strict experimental "${outPath}"`;
  exec(cmd, (err, stdout, stderr) => {
    if (err) return callback(err);
    callback(null, outPath);
  });
}

module.exports = { mergeChunks };
