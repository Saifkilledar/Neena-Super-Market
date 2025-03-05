const svgCaptcha = require('svg-captcha');

const generateCaptcha = () => {
    const captcha = svgCaptcha.create({
        size: 6,
        noise: 2,
        color: true,
        background: '#f0f0f0'
    });

    return {
        text: captcha.text,
        svg: captcha.data
    };
};

const verifyCaptcha = (userInput, storedText) => {
    return userInput.toLowerCase() === storedText.toLowerCase();
};

module.exports = {
    generateCaptcha,
    verifyCaptcha
};
