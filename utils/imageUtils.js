const fs = require('fs');
const path = require('path');

const processBase64Image = (imageBase64, imageType, id) => {
    const match = imageBase64.match(/^data:image\/(\w+);base64,/);
    if (!match) {
        throw new Error('Invalid image format');
    }

    const fileExtension = match[1];
    const imageBuffer = Buffer.from(imageBase64.split(',')[1], 'base64');
    const imageName = `${imageType}_${id}_${Date.now()}.${fileExtension}`;
    const imagePath = path.join(__dirname, '../uploads', imageName);

    fs.writeFileSync(imagePath, imageBuffer);

    return imagePath;
};

const convertImageToBase64 = (imageFile) => {
    const imageBuffer = fs.readFileSync(imageFile);
    const mimeType = `image/${imageFile.split('.').pop()}`;
    return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
};

module.exports = {
    processBase64Image,
    convertImageToBase64
};
