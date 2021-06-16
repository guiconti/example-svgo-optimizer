const sharp = require('sharp');
const fs = require('fs');

const currentBase64 = fs.readFileSync('./base64image.txt', 'utf-8');
const width = 500;
const height = 500;

const parts = currentBase64.split(";");
const mimeType = parts[0].split(":")[1];
const imageData = parts[1].split(",")[1];
const currentImage = new Buffer.from(imageData, "base64");

sharp(currentImage)
  .resize(width, height)
  .toBuffer()
  .then(optimizedImageBuffer => {
    const optimizedImageData = optimizedImageBuffer.toString('base64');
    const optimizedBase64 = `data:${mimeType};base64,${optimizedImageData}"/>`;
    fs.writeFileSync('./resultBase64Image.txt', optimizedBase64);
  });