import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { Lead } from '../models/Lead';
import { createLeadSchema } from '../utils/validation';

export const createLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = createLeadSchema.parse(req.body);

    const existingLead = await Lead.findOne({ email: validatedData.email });
    if (existingLead) {
      res.status(200).json({
        success: true,
        message: 'You are already on our waitlist',
      });
      return;
    }

    await Lead.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Successfully joined the waitlist',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || 'Failed to join waitlist',
    });
  }
};

export const getAllLeads = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Lead.countDocuments();

    res.json({
      success: true,
      data: {
        leads,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
    });
  }
};