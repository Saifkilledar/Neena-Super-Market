const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const optimizeImage = async (buffer, options = {}) => {
    const {
        width = 800,
        quality = 80,
        format = 'jpeg'
    } = options;

    try {
        const optimizedBuffer = await sharp(buffer)
            .resize(width, null, {
                fit: 'inside',
                withoutEnlargement: true
            })
            [format]({
                quality,
                progressive: true
            })
            .toBuffer();

        return optimizedBuffer;
    } catch (error) {
        console.error('Image optimization error:', error);
        throw error;
    }
};

const generateThumbnail = async (buffer) => {
    try {
        const thumbnail = await sharp(buffer)
            .resize(200, 200, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({
                quality: 70
            })
            .toBuffer();

        return thumbnail;
    } catch (error) {
        console.error('Thumbnail generation error:', error);
        throw error;
    }
};

module.exports = {
    optimizeImage,
    generateThumbnail
};
