import { Response } from 'express';
import { AuthRequest } from '../types';
import { User } from '../models/User';
import { updateProfileSchema } from '../utils/validation';

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-passwordHash');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || 'Update failed',
    });
  }
};