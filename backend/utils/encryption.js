const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';

const getKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error('ENCRYPTION_KEY is not set');
  return crypto.createHash('sha256').update(key).digest();
};

const encryptBuffer = (buffer) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
};

const decryptStream = (ivHex) => {
  const iv = Buffer.from(ivHex, 'hex');
  return crypto.createDecipheriv(ALGORITHM, getKey(), iv);
};

module.exports = { encryptBuffer, decryptStream };
