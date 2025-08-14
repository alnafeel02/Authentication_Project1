import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'; 
import transporter from '../config/transporter.js';




export const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.json({ success:false ,message: "All fields are required" });
    }

  try {
    const existingUser = await userModel.findOne({ email });
    
    if (existingUser) {
      return res.json({ success: false,message: "User already exists" });
    }
      const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new userModel({ name, email, password:hashedPassword });
    await newUser.save();
    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production'? none : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    // Send welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Auth Project',
      text: `Hello ${name},\n\nThank you for registering with us! Your account has been created successfully.\n\nBest regards,\nAuth Project Team`
    };
    
    const result = await transporter.sendMail((mailOptions));
    console.log("result", result);

    return res.json({ success:true, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}   

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production'? none : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Auth Project",
      text: `Hello ${email},\n\nThank you for login with us! Your account has been login successfully.\n\nBest regards,\nAuth Project Team`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ success:true, message: "Logout successful" });
}

export const sendVerifyOtp = async (req, res) => {
 
  try {
     const { userId } = req;
    if (!userId) return res.json({ error: "Missing userId" });
    const user = await userModel.findById(userId);
    if (user.isAccountverified) {
      return res
        .json({ success: false, message: "Account already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your account",
      text: `Your verification code is ${otp}. Please use this code to verify your account.`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


export const verifyEmail = async (req, res) => {
  const { userId} = req;
  const { otp } = req.body;
  if (!userId || !otp) {
    return res.json({ success: false, message: "User ID and OTP are required" });
  }
  console.log("User ID:", userId, "OTP:", otp);

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    // console.log("user verifyOtp:", user.verifyOtp, "OTP:", otp);
     if (user.verifyOtp == otp) {
       return res
         .status(200)
         .json({ success: true, message: "Email verified successfully" });
     }
      if (user.verifyOtp !== otp || user.verifyOtp === "") {
        return res.json({ success: false, message: "Invalid OTP" });
      }
    if(user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }
   
    user.isAccountverified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();
    return res.status(200).json({ success: true, message: "Email verified successfully" });

  }  
  catch(error) {
      console.error("Error verifying email:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const isAccountVerified = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    } 
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, isVerified: user.isAccountverified });

  } catch (error) {
    console.error("Error checking account verification:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const sendResetPasswordOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP for resetting your password is ${otp}. Please use this code to reset your password.`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending reset password OTP:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


export const resetPassword = async (req, res) => {
  
  const { email,otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "All are required" });
  }
  console.log("Email:", email, "OTP:", otp, "New Password:", newPassword);
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log("user resetOtp:", user.resetOtp, "OTP:", otp);
    if (user.resetOtp !== otp || user.resetOtp === "") {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if(user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
