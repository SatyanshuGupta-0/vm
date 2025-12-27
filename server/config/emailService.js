const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// 🔍 VERIFY SMTP ON START
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP VERIFY FAILED:", error.message);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

const sendEmail = async (to, subject, text, html) => {
  console.log("📨 [EMAIL_SERVICE] sendMail started");

  if (!to) throw new Error("Recipient email missing");

  const info = await transporter.sendMail({
    from: `"VM App" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("✅ [EMAIL_SERVICE] Email sent:", info.messageId);
  return true;
};

module.exports = sendEmail;
