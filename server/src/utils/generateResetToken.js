import crypto from "crypto";

const generateResetToken = () => {
  // 1. Generate raw token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2. Hash token (for DB storage)
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return {
    resetToken,   // send via email
    hashedToken,  // store in DB
  };
};

export default generateResetToken;