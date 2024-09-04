// Email functionality using Nodemailer and SMTP2GO

import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    // Logs the request body
    const { email, subject, text, html, attachments } = await req.json();
    console.log("Received request with data:", {
      email,
      subject,
      text,
      html,
      attachments,
    });

    // Transporter object using SMTP2GO
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("SMTP transporter configured");

    // Defines email options - uses email associated with smtp2go
    const mailOptions = {
      from: "jbarbour95@hotmail.com",
      to: email,
      subject: subject,
      text: text,
      html: html,
      attachments: attachments.map((attachment) => ({
        filename: attachment.filename,
        path: attachment.content,
        contentType: "application/pdf",
      })),
    };

    console.log("Mail options prepared:", mailOptions);

    // Sends the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
