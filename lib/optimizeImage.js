const sharp = require('sharp');

function optimizeImage() {
  return ({ image, mimeType, optimizedWidth, optimizedHeight }) => {
    return sharp(image)
      .resize(optimizedWidth, optimizedHeight)
      .toBuffer()
      .then(optimizedImageBuffer => {
        const optimizedImageData = optimizedImageBuffer.toString('base64');
        const optimizedBase64 = `data:${mimeType};base64,${optimizedImageData}`;
        return optimizedBase64;
      });
  }
}

module.exports = optimizeImage;
