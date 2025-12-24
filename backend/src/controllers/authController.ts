import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User';
import { PasswordReset } from '../models/PasswordReset';
import { generateToken } from '../utils/jwt';
import { sendPasswordResetEmail } from '../utils/email';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/validation';


export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await User.create({
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      passwordHash: hashedPassword,
      role: 'user',
    });

    const token = generateToken({ id: user._id.toString(), role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || 'Signup failed',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      return;
    }

    const token = generateToken({ id: user._id.toString(), role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || 'Login failed',
    });
  }
};

// export const forgotPasswordz = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const validatedData = forgotPasswordSchema.parse(req.body);

//     const user = await User.findOne({ email: validatedData.email });
//     if (!user) {
//       res.json({
//         success: true,
//         message: 'If an account exists, a reset link has been sent',
//       });
//       return;
//     }

//     await PasswordReset.deleteMany({ userId: user._id });

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//     await PasswordReset.create({
//       userId: user._id,
//       token: hashedToken,
//       expiresAt: new Date(Date.now() + 3600000),
//     });

//     await sendPasswordResetEmail(user.email, resetToken);

//     res.json({
//       success: true,
//       message: 'If an account exists, a reset link has been sent',
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message || 'Failed to process request',
//     });
//   }
// };

// export const resetPasswordz = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { token } = req.params;
//     const validatedData = resetPasswordSchema.parse(req.body);

//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//     const resetRecord = await PasswordReset.findOne({
//       token: hashedToken,
//       expiresAt: { $gt: new Date() },
//     });

//     if (!resetRecord) {
//       res.status(400).json({
//         success: false,
//         message: 'Invalid or expired reset token',
//       });
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(validatedData.password, 10);

//     await User.findByIdAndUpdate(resetRecord.userId, {
//       passwordHash: hashedPassword,
//     });

//     await PasswordReset.deleteMany({ userId: resetRecord.userId });

//     res.json({
//       success: true,
//       message: 'Password reset successfully',
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.errors?.[0]?.message || 'Password reset failed',
//     });
//   }
// };

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const oauthLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { provider, email, name, image } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with OAuth
      user = await User.create({
        fullName: name || email.split('@')[0],
        email,
        passwordHash: 'oauth', // No password for OAuth users
        role: 'user',
      });
    }

    const token = generateToken({ id: user._id.toString(), role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.json({
      success: true,
      message: 'OAuth login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'OAuth login failed',
    });
  }
};




export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If an account exists, a reset link will be sent',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before saving to database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save hashed token and expiry to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send email with unhashed token
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request',
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash the token from URL to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    user.passwordHash = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
    });
  }
};