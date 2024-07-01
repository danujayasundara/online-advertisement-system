const fs = require('fs');
const path = require('path');

const getMimeType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
        case '.bmp':
            return 'image/bmp';
        default:
            throw new Error('Unsupported image format');
    }
};

//specify the path
const imagePath = path.join(__dirname, 'images','12.jpg');

//read image file into a buffer
const imageBuffer = fs.readFileSync(imagePath);

//get MIME type of image
const mimeType = getMimeType(imagePath);

//convert buffer to base64 string
const imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

console.log('Image base64: ', imageBase64);