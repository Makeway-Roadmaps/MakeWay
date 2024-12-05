const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (to, subject, text) => {
  try {
    // Ensure environment variables are set
    const { MAIL_HOST, MAIL_USER, MAIL_PASS } = process.env;
    if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
      console.warn("Mail configuration is incomplete.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: 587, // Common SMTP port
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });
    // Send email
    // Define the email content
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2C3E50; margin: 0;">Welcome to MakeWay!</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <p style="color: #2C3E50; font-size: 16px; margin-bottom: 15px;">
                    Thank you for choosing MakeWay! We're excited to have you on board.
                </p>
                <p style="color: #2C3E50; font-size: 16px; margin-bottom: 15px;">
                    To ensure the security of your account, please verify your email address using the following OTP:
                </p>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <h2 style="color: #007BFF; font-size: 24px; margin: 0;">${text}</h2>
                </div>
                <p style="color: #2C3E50; font-size: 14px;">
                    This OTP is valid for a limited time. Please enter it on the verification page to complete your registration.
                </p>
            </div>
    
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                    If you didn't request this verification, please ignore this email or contact our support team.
                </p>
                <p style="color: #666; font-size: 14px;">
                    For security reasons, please don't share this OTP with anyone.
                </p>
            </div>
    
            <div style="margin-top: 30px; text-align: center;">
                <p style="color: #2C3E50; font-size: 16px; font-weight: bold; margin-bottom: 5px;">
                    Best regards,
                </p>
                <p style="color: #2C3E50; font-size: 16px;">
                    The MakeWay Team
                </p>
            </div>
    
            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                <p>© ${new Date().getFullYear()} MakeWay. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    const info = await transporter.sendMail({
      from: `"MakeWay" <${MAIL_USER}>`,
      to,
      subject,
      text,
      html: emailContent, // Dynamic HTML body
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = mailSender;
