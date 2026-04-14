import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import generateResetToken from "../utils/generateResetToken.js";
import sendEmail from "../config/email.js";


// =======================
// 🔐 FORGOT PASSWORD
// =======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Generate token (raw + hashed)
    const { resetToken, hashedToken } = generateResetToken();

    // ✅ Save hashed token in DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 🔗 Create reset URL (send RAW token)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password</p>
      <a href="${resetUrl}" style="color:blue;">Click here to reset password</a>
      <p>This link will expire in 10 minutes</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset",
        message,
      });

      console.log(`Reset link sent to ${user.email}`);

      res.json({ message: "Reset link sent to email ✅" });

    } catch (error) {
      // ❌ rollback if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({ message: "Email could not be sent ❌" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// 🔁 RESET PASSWORD
// =======================
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // ✅ Hash incoming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // ✅ Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // ✅ Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful ✅" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// 🧾 REGISTER
// =======================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    const normalizedEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// 🔓 LOGIN
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};