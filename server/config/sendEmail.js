const sendEmail = require("./emailService");

const sendEmailFun = async (to, subject, text, html) => {
    const result = await sendEmail(to, subject, text, html);
    return result; // Simplified to return the boolean result directly
};

module.exports = sendEmailFun;

// const sendEmail = require("./emailService");

// const sendEmailFun = async (to, subject, text, html) => {
//   try {
//     await sendEmail(to, subject, text, html);
//     return true;
//   } catch (error) {
//     console.error("❌ Email Error:", error.message);
//     return false;
//   }
// };

// module.exports = sendEmailFun;

