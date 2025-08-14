import express from 'express';
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  resetPassword,
  isAccountVerified,
  sendResetPasswordOtp
} from "../controller/authController.js";
import userAuth from '../middleware/userAuth.js';
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-email", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAccountVerified);
authRouter.post("/pass-otp", sendResetPasswordOtp);
authRouter.post("/reset-pass", resetPassword);


export default authRouter;