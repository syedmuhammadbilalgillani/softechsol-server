import nodemailer from "nodemailer";

export async function sendWelcomeEmail(
  email: string,
  businessName: string,
  subdomain: string
) {
  try {
    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or "smtp.yourprovider.com"
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Email content
    const mailOptions = {
      from: `"DevClyst Onboarding" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🎉 Welcome to DevClyst, ${businessName}!`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;background:#f9fafb;">
          <h2 style="color:#4f46e5;">Welcome to DevClyst 🚀</h2>
          <p>Hi <strong>${businessName}</strong>,</p>
          <p>We’re excited to have you onboard!</p>
          <p>Your restaurant system has been successfully set up on:</p>
          <p style="font-size:16px;font-weight:bold;">
            🌐 <a href="https://${subdomain}.devclyst.com" target="_blank">${subdomain}.devclyst.com</a>
          </p>
          <p>We’ve started your trial period. Explore your dashboard, manage menus, and streamline orders instantly.</p>
          <br/>
          <p>Need help? Our team is just one email away.</p>
          <p style="color:#6b7280;font-size:13px;">– The DevClyst Team</p>
        </div>
      `,
    };

    // ✅ Send the email
    await transporter.sendMail(mailOptions);

    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}
