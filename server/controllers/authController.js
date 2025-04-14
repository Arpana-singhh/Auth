import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModels.js'
import transporter from '../config/nodemailer.js'
// Register
export const register = async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing Details' });
    }
  
    try {
      const existingUser = await userModel.findOne({ email });
  
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'User already exists' }); // 409 Conflict
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new userModel({ name, email, password: hashedPassword });
      await user.save();
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Welcome to LOL',
        text: `Welcome to LoL website. Your account has been created with email id: ${email}`,
      };
  
      await transporter.sendMail(mailOptions);
      return res.status(201).json({ success: true }); // 201 Created
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and Password are required' });
    }
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid Email' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid Password' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Logout

export const logout = async (req, res) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ success: true, message: 'Logged Out' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  


// Send the otp to email
export const sendVerifyOtp = async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User Not Found' });
      }
  
      if (user.isAccountVerified) {
        return res.status(200).json({ success: true, message: 'Account Already Verified' });
      }
  
      const otp = String(Math.floor(10000 + Math.random() * 900000));
      user.verifyOtp = otp;
      user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
  
      await user.save();
  
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Account Verification OTP',
        text: `Your OTP is ${otp}. Verify your account using this OTP`,
      };
  
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: 'Verification OTP Sent on Email' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Verify the email using OTP
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
  
    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: 'Missing Details' });
    }
  
    try {
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User Not Found' });
      }
  
      if (user.verifyOtp === '' || user.verifyOtp !== otp) {
        return res.status(401).json({ success: false, message: 'Invalid OTP' });
      }
  
      if (user.verifyOtpExpireAt < Date.now()) {
        return res.status(410).json({ success: false, message: 'OTP Expired' }); // 410 Gone
      }
  
      user.isAccountVerified = true;
      user.verifyOtp = '';
      user.verifyOtpExpireAt = 0;
  
      await user.save();
      return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Check if User is authenticated
export const isAuthenticated = async (req, res) => {
    try {
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  

//Send Password Reset OTP

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is Required' });
    }
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const otp = String(Math.floor(10000 + Math.random() * 900000));
      user.resetOtp = otp;
      user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
  
      await user.save();
  
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Password Reset OTP',
        text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
      };
  
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: 'OTP Sent to your Email' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Reset User Password

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and New Password are required' });
    }
  
    try {
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      if (user.resetOtp === '' || user.resetOtp !== otp) {
        return res.status(401).json({ success: false, message: 'Invalid OTP' });
      }
  
      if (user.resetOtpExpireAt < Date.now()) {
        return res.status(410).json({ success: false, message: 'OTP Expired' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetOtp = '';
      user.resetOtpExpireAt = 0;
  
      await user.save();
      return res.status(200).json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  