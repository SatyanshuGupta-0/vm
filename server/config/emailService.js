// // const nodemailer = require("nodemailer");

// // const transporter = nodemailer.createTransport({
// //     host: "smtp.gmail.com",
// //     port: 465,
// //     secure: true, // true for port 465, false for other ports
// //     auth: {
// //         user: process.env.EMAIL,
// //         pass: process.env.EMAIL_PASS,
// //     },
// // });

// // const sendEmail = async (to, subject, text, html) => {
// //     try {
// //         // Validate recipient email
// //         if (!to) throw new Error("Recipient email is not defined");
// //         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new Error("Invalid email format");

// //         const info = await transporter.sendMail({
// //             from: process.env.EMAIL, // Sender's address
// //             to, // Recipient's address
// //             subject, // Subject line
// //             text, // Plain text body
// //             html, // HTML body
// //         });

// //         return ("Email sent successfully:", info.messageId);
// //     } catch (error) {
// //         console.error("Error sending email:", error);
// //         return false;
// //     }
// // };

// // module.exports = sendEmail;

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendEmail = async (to, subject, text, html) => {
//   if (!to) throw new Error("Recipient email missing");

//   await transporter.sendMail({
//     from: process.env.EMAIL,
//     to,
//     subject,
//     text,
//     html,
//   });

//   return true;
// };

// module.exports = sendEmail;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,          // 👈 IMPORTANT (more reliable than 465)
  secure: false,      // must be false for 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS, // 👈 APP PASSWORD ONLY
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// 🔍 VERIFY SMTP ON SERVER START
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP VERIFY FAILED:", error.message);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    if (!to) throw new Error("Recipient email missing");

    console.log("📤 Sending email to:", to);

    await transporter.sendMail({
      from: `"VM App" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent to:", to);
    return true;
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    return false;
  }
};

module.exports = sendEmail;








