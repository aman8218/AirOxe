import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { IOrder } from '../types';
dotenv.config();
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p>We received a request to reset your password for your <strong>AirOxe</strong> account.</p>
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #3B82F6;">${resetUrl}</p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0;">
              <li>This link expires in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password won't change until you create a new one</li>
            </ul>
          </div>
          
          <p>Thanks,<br><strong>Team AirOxe</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AirOxe. All rights reserved.</p>
          <p style="font-size: 12px; color: #999;">Clean Air. Smart Living.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Reset Your AirOxe Password',
    html,
  });
};

export const sendContactEmail = async (contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #3B82F6; }
        .label { font-weight: bold; color: #3B82F6; margin-bottom: 5px; }
        .message-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 20px;">You have received a new message from your AirOxe website contact form.</p>
          
          <div class="info-box">
            <div class="label">Name:</div>
            <div>${contactData.name}</div>
          </div>
          
          <div class="info-box">
            <div class="label">Email:</div>
            <div><a href="mailto:${contactData.email}" style="color: #3B82F6;">${contactData.email}</a></div>
          </div>
          
          <div class="info-box">
            <div class="label">Subject:</div>
            <div>${contactData.subject}</div>
          </div>
          
          <div class="message-box">
            <div class="label" style="margin-bottom: 10px;">Message:</div>
            <div style="white-space: pre-wrap;">${contactData.message}</div>
          </div>
          
          <p style="margin-top: 20px; padding: 15px; background: #EFF6FF; border-radius: 8px; font-size: 14px;">
            💡 <strong>Quick Reply:</strong> Click on the email address above to respond directly to the sender.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AirOxe. All rights reserved.</p>
          <p style="font-size: 12px; color: #999;">This email was sent from your website contact form</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: process.env.CONTACT_EMAIL_USER || process.env.EMAIL_USER!,
    subject: `Contact Form: ${contactData.subject}`,
    html,
  });
};

// Order Confirmation Email to Customer
export const sendOrderConfirmationEmail = async (order: any, customerEmail: string, customerName: string) => {
  try {
    console.log('Sending order confirmation email to:', customerEmail);
    console.log('Order ID:', order._id);
    
    const productsHtml = order.products.map((item: any) => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong><br>
          <span style="color: #666; font-size: 14px;">Qty: ${item.qty}</span>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ₹${item.price.toLocaleString()}
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          <strong>₹${(item.price * item.qty).toLocaleString()}</strong>
        </td>
      </tr>
    `).join('');

    const orderId = order._id.toString().slice(-8).toUpperCase();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
          .total-row { background: #EFF6FF; padding: 15px; margin-top: 15px; border-radius: 8px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Thank you for your order</p>
          </div>
          <div class="content">
            <p style="font-size: 16px;">Hi <strong>${customerName}</strong>,</p>
            <p>Your order has been confirmed and will be processed shortly.</p>
            
            <div class="order-box">
              <h3 style="margin-top: 0; color: #3B82F6;">Order Details</h3>
              <div style="margin: 15px 0;">
                <strong>Order ID:</strong> #${orderId}<br>
                <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}<br>
                <strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </div>
              
              <h4 style="margin-top: 20px; margin-bottom: 10px;">Items:</h4>
              <table>
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                    <th style="padding: 10px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsHtml}
                </tbody>
              </table>
              
              <div class="total-row">
                <div style="display: flex; justify-content: space-between; font-size: 18px;">
                  <strong>Total Amount:</strong>
                  <strong style="color: #3B82F6;">₹${order.totalAmount.toLocaleString()}</strong>
                </div>
              </div>
            </div>
            
            <div class="order-box">
              <h3 style="margin-top: 0; color: #3B82F6;">Shipping Address</h3>
              <p style="margin: 0; line-height: 1.8;">
                <strong>${order.shippingAddress.fullName}</strong><br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.landmark ? `${order.shippingAddress.landmark}<br>` : ''}
                PIN: ${order.shippingAddress.pin}<br>
                Phone: ${order.shippingAddress.phone}
              </p>
            </div>
            
            <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <strong>📦 What's Next?</strong>
              <ul style="margin: 10px 0;">
                <li>Your order will be processed within 24 hours</li>
                <li>You'll receive tracking details once shipped</li>
                <li>Expected delivery: 2-3 business days</li>
              </ul>
            </div>
            
            <p style="margin-top: 30px;">
              If you have any questions, feel free to reply to this email or contact us at 
              <a href="mailto:support@airoxe.in" style="color: #3B82F6;">support@airoxe.in</a>
            </p>
            
            <p>Thanks,<br><strong>Team AirOxe</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} AirOxe. All rights reserved.</p>
            <p style="font-size: 12px; color: #999;">Clean Air. Smart Living.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await sendEmail({
      to: customerEmail,
      subject: `Order Confirmed - #${orderId}`,
      html,
    });

    console.log('Order confirmation email sent successfully');
    return result;
  } catch (error) {
    console.error('Error in sendOrderConfirmationEmail:', error);
    throw error;
  }
};

// Order Notification Email to Seller
export const sendOrderNotificationToSeller = async (order: any, customerName: string, customerEmail: string) => {
  const productsHtml = order.products.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;"><strong>₹${(item.price * item.qty).toLocaleString()}</strong></td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: #1F2937; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; background: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Order Received!</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Order #${order._id.toString().slice(-8).toUpperCase()}</p>
        </div>
        <div class="content">
          <div class="alert">
            <strong>⚡ Action Required:</strong> A new order has been placed and requires processing.
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0;">Customer Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${customerName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}</p>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0;">Order Items</h3>
            <table>
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
                <tr style="background: #EFF6FF;">
                  <td colspan="3" style="padding: 15px; text-align: right;"><strong>Total Amount:</strong></td>
                  <td style="padding: 15px; text-align: right;"><strong style="color: #3B82F6; font-size: 18px;">₹${order.totalAmount.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p style="margin: 0; line-height: 1.8;">
              <strong>${order.shippingAddress.fullName}</strong><br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.landmark ? `${order.shippingAddress.landmark}<br>` : ''}
              PIN: ${order.shippingAddress.pin}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/admin/orders" 
               style="display: inline-block; background: #1F2937; color: white; 
                      padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              View Order in Admin Panel
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: process.env.EMAIL_USER || 'amankumarpremium@gmail.com',
    subject: `🔔 New Order #${order._id.toString().slice(-8).toUpperCase()} - ₹${order.totalAmount.toLocaleString()}`,
    html,
  });
};

// Order Cancellation Email to Customer
export const sendOrderCancellationEmail = async (order: any, customerEmail: string, customerName: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Order Cancelled</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px;">Hi <strong>${customerName}</strong>,</p>
          <p>Your order <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> has been successfully cancelled.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #EF4444;">Cancellation Details</h3>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p style="margin: 5px 0;"><strong>Cancelled On:</strong> ${new Date(order.cancelledAt).toLocaleString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Reason:</strong> ${order.cancellationReason}</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${order.totalAmount.toLocaleString()}</p>
          </div>
          
          <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <strong>💰 Refund Information:</strong>
            <ul style="margin: 10px 0;">
              <li>${order.paymentMethod === 'cod' ? 'No refund required as payment was not made' : 'Refund will be processed within 5-7 business days'}</li>
              <li>${order.paymentMethod === 'online' ? 'Amount will be credited to your original payment method' : ''}</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">
            We're sorry to see you cancel your order. If you have any questions or concerns, 
            please don't hesitate to contact us at 
            <a href="mailto:support@airoxe.in" style="color: #3B82F6;">support@airoxe.in</a>
          </p>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/products" 
               style="display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); 
                      color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Continue Shopping
            </a>
          </p>
          
          <p>Thanks,<br><strong>Team AirOxe</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AirOxe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: customerEmail,
    subject: `Order Cancelled - #${order._id.toString().slice(-8).toUpperCase()}`,
    html,
  });
};

// Cancellation Notification to Seller
export const sendCancellationNotificationToSeller = async (order: any, customerName: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #DC2626; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #FEE2E2; border-left: 4px solid #DC2626; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Order Cancelled</h1>
        </div>
        <div class="content">
          <div class="alert">
            <strong>Customer Cancelled Order #${order._id.toString().slice(-8).toUpperCase()}</strong>
          </div>
          
          <div class="info-box">
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${customerName}</p>
            <p style="margin: 5px 0;"><strong>Order Amount:</strong> ₹${order.totalAmount.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'COD' : 'Online'}</p>
            <p style="margin: 5px 0;"><strong>Cancelled On:</strong> ${new Date(order.cancelledAt).toLocaleString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Reason:</strong> ${order.cancellationReason}</p>
          </div>
          
          ${order.paymentMethod === 'online' ? `
          <div style="background: #FEF3C7; padding: 15px; border-radius: 4px;">
            <strong>⚡ Action Required:</strong> Process refund of ₹${order.totalAmount.toLocaleString()} within 5-7 business days
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: process.env.EMAIL_USER || 'amankumarpremium@gmail.com',
    subject: `❌ Order Cancelled - #${order._id.toString().slice(-8).toUpperCase()}`,
    html,
  });
};

// Return Request Email to Customer
export const sendReturnRequestEmail = async (order: any, customerEmail: string, customerName: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔄 Return Request Received</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px;">Hi <strong>${customerName}</strong>,</p>
          <p>We've received your return request for order <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong>.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #F59E0B;">Return Details</h3>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p style="margin: 5px 0;"><strong>Request Date:</strong> ${new Date(order.returnRequestedAt).toLocaleString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Reason:</strong> ${order.returnReason}</p>
            <p style="margin: 5px 0;"><strong>Refund Amount:</strong> ₹${order.totalAmount.toLocaleString()}</p>
          </div>
          
          <div style="background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <strong>📋 What's Next?</strong>
            <ul style="margin: 10px 0;">
              <li>Our team will review your request within 24-48 hours</li>
              <li>You'll receive pickup instructions via email</li>
              <li>Once product is received, refund will be processed within 5-7 days</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">
            If you have any questions, please contact us at 
            <a href="mailto:support@airoxe.in" style="color: #3B82F6;">support@airoxe.in</a>
          </p>
          
          <p>Thanks,<br><strong>Team AirOxe</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AirOxe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: customerEmail,
    subject: `Return Request Received - #${order._id.toString().slice(-8).toUpperCase()}`,
    html,
  });
};

// Return Request Notification to Seller
export const sendReturnNotificationToSeller = async (order: any, customerName: string, customerEmail: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #D97706; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔄 Return Request</h1>
        </div>
        <div class="content">
          <div class="alert">
            <strong>⚡ Action Required:</strong> Customer has requested return for Order #${order._id.toString().slice(-8).toUpperCase()}
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0;">Customer Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${customerName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0;">Return Details</h3>
            <p style="margin: 5px 0;"><strong>Order Amount:</strong> ₹${order.totalAmount.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Request Date:</strong> ${new Date(order.returnRequestedAt).toLocaleString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Return Reason:</strong> ${order.returnReason}</p>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0;">Pickup Address</h3>
            <p style="margin: 0; line-height: 1.8;">
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.landmark ? `${order.shippingAddress.landmark}<br>` : ''}
              PIN: ${order.shippingAddress.pin}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>
          
          <div style="background: #DBEAFE; padding: 15px; border-radius: 4px; margin-top: 20px;">
            <strong>Next Steps:</strong>
            <ol style="margin: 10px 0;">
              <li>Review the return request</li>
              <li>Arrange pickup within 24-48 hours</li>
              <li>Process refund after receiving the product</li>
            </ol>
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/admin/orders" 
               style="display: inline-block; background: #D97706; color: white; 
                      padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              View in Admin Panel
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: process.env.EMAIL_USER || 'amankumarpremium@gmail.com',
    subject: `🔄 Return Request - #${order._id.toString().slice(-8).toUpperCase()}`,
    html,
  });
};