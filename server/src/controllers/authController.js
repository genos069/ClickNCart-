import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import generateToken from "../utils/generateToken.js";
import generateResetToken from "../utils/generateResetToken.js";
import sendEmail from "../config/email.js";
import { email, password, text, fail } from "../utils/validation.js";
const profile = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user),
});
export const registerUser = async (req, res) => {
  const name = text(req.body.name, "name", 100),
    normalized = email(req.body.email),
    pass = password(req.body.password);
  if (await User.exists({ email: normalized }))
    fail("An account already exists", 409);
  const user = await User.create({
    name,
    email: normalized,
    password: await bcrypt.hash(pass, 12),
  });
  res.status(201).json(profile(user));
};
export const loginUser = async (req, res) => {
  const normalized = email(req.body.email);
  if (
    typeof req.body.password !== "string" ||
    Buffer.byteLength(req.body.password) > 72
  )
    fail("Invalid email or password", 401);
  const user = await User.findOne({ email: normalized });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    fail("Invalid email or password", 401);
  res.json(profile(user));
};
export const forgotPassword = async (req, res) => {
  const normalized = email(req.body.email);
  const user = await User.findOne({ email: normalized });
  if (user) {
    const { resetToken, hashedToken } = generateResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 600000;
    await user.save();
    try {
      await sendEmail({
        email: user.email,
        subject: "ClickNCart password reset",
        message: `<p>Reset your password within 10 minutes:</p><a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset password</a>`,
      });
    } catch {
      await User.updateOne(
        { _id: user._id, resetPasswordToken: hashedToken },
        { $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 } },
      );
      console.error("Password reset email delivery failed");
    }
  }
  res.json({
    message:
      "If the account exists, a reset link will be sent to its email address",
  });
};
export const resetPassword = async (req, res) => {
  const pass = password(req.body.password);
  if (!/^[a-f\d]{40,128}$/i.test(req.params.token))
    fail("Invalid or expired token");
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOneAndUpdate(
    { resetPasswordToken, resetPasswordExpire: { $gt: new Date() } },
    {
      $set: { password: await bcrypt.hash(pass, 12) },
      $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 },
      $inc: { tokenVersion: 1 },
    },
  );
  if (!user) fail("Invalid or expired token");
  res.json({ message: "Password reset successful. Sign in again" });
};
