
function generateReferralCode(name = "") {
  return (
    name.substring(0, 4).toUpperCase() +
    Math.floor(1000 + Math.random() * 9000)
  );
}

module.exports = generateReferralCode;
