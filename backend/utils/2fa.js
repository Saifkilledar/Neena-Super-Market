const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const generate2FASecret = () => {
    return speakeasy.generateSecret({
        name: 'Neena Super-Market'
    });
};

const verify2FAToken = (secret, token) => {
    return speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token: token
    });
};

const generateQRCode = async (secret) => {
    try {
        const otpauthUrl = secret.otpauth_url;
        return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
        throw new Error('Error generating QR code');
    }
};

module.exports = {
    generate2FASecret,
    verify2FAToken,
    generateQRCode
};
