const nodemailer = require('nodemailer');

const buildTransport = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    const error = new Error('SMTP configuration is incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.');
    error.statusCode = 500;
    throw error;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
};

const sendRegistrationOtp = async ({ email, name, otpCode }) => {
  const transport = buildTransport();
  const fromName = process.env.SMTP_FROM_NAME || 'Smart Study Planner';

  await transport.sendMail({
    from: `"${fromName}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Smart Study Planner OTP',
    text: `Hello ${name}, your verification OTP is ${otpCode}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #10203e;">
        <h2>Smart Study Planner</h2>
        <p>Hello ${name},</p>
        <p>Your registration OTP is:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 16px 0;">${otpCode}</div>
        <p>This OTP expires in 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `
  });
};

const sendPasswordResetOtp = async ({ email, name, otpCode }) => {
  const transport = buildTransport();
  const fromName = process.env.SMTP_FROM_NAME || 'Smart Study Planner';

  await transport.sendMail({
    from: `"${fromName}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your Smart Study Planner password',
    text: `Hello ${name}, your password reset OTP is ${otpCode}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #10203e;">
        <h2>Smart Study Planner</h2>
        <p>Hello ${name},</p>
        <p>Your password reset OTP is:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 16px 0;">${otpCode}</div>
        <p>This OTP expires in 10 minutes.</p>
        <p>If you did not request a password reset, you can ignore this email.</p>
      </div>
    `
  });
};

module.exports = { sendRegistrationOtp, sendPasswordResetOtp };
