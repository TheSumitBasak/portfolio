import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function sendEmail(textVersion: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL, // Ensure EMAIL_USER is set in the .env file
      pass: process.env.GMAIL_PASSWORD, // Ensure EMAIL_PASSWORD is set in the .env file
    },
  });

  const mailOptions = {
    from: "protfolio@gmail.com",
    to: process.env.GMAIL_EMAIL,
    subject: "Portfolio Contact Form Submission",
    text: textVersion,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info; // Return info in case further processing is needed
  } catch (error) {
    console.error("Error sending email:", error);
    // Add context to the error message for better debugging
    throw new Error(`Failed to send email Error: ${error}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    // Send the email
    const result = await sendEmail(JSON.stringify(data));

    // Return a success response
    return new NextResponse(
      JSON.stringify({ message: "Email sent successfully", result }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
