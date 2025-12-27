const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000, // ⏱ 10 sec
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmailFun = async (to, subject, text, html) => {
  console.log("📨 [EMAIL] sendEmailFun started");

  if (!to) throw new Error("Recipient email missing");

  try {
    const info = await transporter.sendMail({
      from: `"VM App" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ [EMAIL] Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ [EMAIL] sendMail failed:", error.message);
    throw error;
  }
};

module.exports = sendEmailFun;
