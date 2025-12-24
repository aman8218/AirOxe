import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
};