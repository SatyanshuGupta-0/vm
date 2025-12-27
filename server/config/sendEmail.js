const sendEmail = require("./emailService");

const sendEmailFun = async (to, subject, text, html) => {
  console.log("📨 [EMAIL_FUN] Function called");
  console.log("📨 [EMAIL_FUN] To:", to);
  console.log("📨 [EMAIL_FUN] Subject:", subject);

  try {
    const result = await sendEmail(to, subject, text, html);

    console.log("✅ [EMAIL_FUN] sendEmail returned:", result);
    return result;
  } catch (error) {
    console.error("❌ [EMAIL_FUN] Error:", error.message);
    return false;
  }
};

module.exports = sendEmailFun;

