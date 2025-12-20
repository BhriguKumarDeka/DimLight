const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { 
  registerValidation, 
  loginValidation, 
  forgotPasswordValidation, 
  resetPasswordValidation 
} = require("../middleware/validate");

// --- SIGNUP ---
exports.signup = async (req, res) => {
  try {
    // 1. Validate Input
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, userType } = req.body;

    // 2. Check Duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      userType
    });
    
    // 5. Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    res.status(201).json({ message: "Signup successful", token, user });

    // 6. Send Welcome Email 
    setImmediate(() => {
      sendEmail({
        email: user.email,
        subject: "Welcome to DimLight!",
        title: "Welcome Aboard!",
        message: `Hi ${user.name},\n\nWe are excited to help you start your journey to better sleep.`,
        actionUrl: `${process.env.FRONTEND_URL}/dashboard`,
        actionText: "Go to Dashboard",
      }).catch(err => {
        console.error("Welcome email failed:", err);
      });
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    // 1. Validate Input
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    // 2. Find User (Explicitly select password)
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // 3. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // 4. Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: "Login successful", token, user: userResponse });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
  try {
    // 1. Validate
    const { error } = forgotPasswordValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "No user found with that email" });

    // 2. Generate Reset Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // 3. Create Reset URL (Frontend URL)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    res.status(200).json({ success: true, data: "Password Reset Email sent" });

    setImmediate(() => {
      sendEmail({
        email: user.email,
        subject: "Reset Password",
        title: "Reset Your Password",
        message: "You requested a password reset. Click the button below to set a new password. This link expires in 10 minutes.",
        actionUrl: resetUrl,
        actionText: "Reset Password"
      }).catch( async err => {
        console.error("Reset email failed:", err);
      

      // Rollback if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    });
  });

} catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
  try {
    // 1. Validate Password format
    const { error } = resetPasswordValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // 2. Hash incoming token to match DB
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    // 3. Find user with valid token and time not expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    // 4. Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    // 5. Log them in immediately (Optional) or just send success
    res.status(200).json({
      success: true,
      message: "Password updated success! You can now login."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};