const crypto = require('crypto');

const getOtpSecret = () => process.env.OTP_HASH_SECRET || process.env.JWT_SECRET || 'local-otp-secret';

const generateOtpCode = () => {
  if (process.env.NODE_ENV === 'test' && process.env.TEST_OTP_CODE) {
    return process.env.TEST_OTP_CODE;
  }

  return String(crypto.randomInt(100000, 1000000));
};

const hashOtp = (otp) =>
  crypto.createHmac('sha256', getOtpSecret()).update(String(otp)).digest('hex');

const compareOtp = (candidateOtp, storedHash) => hashOtp(candidateOtp) === storedHash;

module.exports = {
  compareOtp,
  generateOtpCode,
  hashOtp
};
