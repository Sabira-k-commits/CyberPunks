const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any SMTP service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your One-Time Password (OTP)',
    text: `Your OTP is ${otp}. It expires in 2 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
