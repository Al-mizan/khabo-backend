import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";
import { APP_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PUBLIC_APP_URL, PUBLIC_BETTER_AUTH_URL, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "../config/env";
import { UserRole } from '../constants/roles';


type SendEmailOptions = {
  to: string;
  name: string;
  subject: string;
  verificationUrl: string;
};

export async function sendEmail({ to, name, subject, verificationUrl }: SendEmailOptions) {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const html = `<!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Email Verification</title>
                    <style>
                      body {
                        margin: 0;
                        padding: 0;
                        background-color: #f4f6f8;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                          Roboto, Helvetica, Arial, sans-serif;
                      }
                      .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                      }
                      .header {
                        background-color: #0f172a;
                        padding: 20px;
                        text-align: center;
                        color: #ffffff;
                        font-size: 20px;
                        font-weight: 600;
                      }
                      .content {
                        padding: 30px;
                        color: #334155;
                        line-height: 1.6;
                      }
                      .button-wrapper {
                        text-align: center;
                        margin: 30px 0;
                      }
                      .verify-button {
                        display: inline-block;
                        padding: 14px 28px;
                        background-color: #2563eb;
                        color: #ffffff !important;
                        text-decoration: none;
                        font-weight: 600;
                        border-radius: 6px;
                      }
                      .footer {
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #64748b;
                        background-color: #f8fafc;
                      }
                      .url {
                        word-break: break-all;
                        font-size: 12px;
                        color: #475569;
                        background: #f1f5f9;
                        padding: 10px;
                        border-radius: 4px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        FoodHub Email Verification
                      </div>

                      <div class="content">
                        <p>Hello ${name}</p>

                        <p>
                          Thanks for signing up! Please confirm your email address to activate
                          your account.
                        </p>

                        <div class="button-wrapper">
                          <a href="${verificationUrl}" class="verify-button">
                            Verify Email
                          </a>
                        </div>

                        <p>
                          If the button doesn’t work, copy and paste this URL into your browser:
                        </p>

                        <div class="url">${verificationUrl}</div>

                        <p>
                          This link will expire for security reasons. If you didn't create an
                          account, you can safely ignore this email.
                        </p>

                        <p>Cheers,<br /> FoodHub Team</p>
                      </div>

                      <div class="footer"> 
                        © ${new Date().getFullYear()} FoodHub. All rights reserved.
                      </div>
                    </div>
                  </body>
                </html>
`;

  const info = await transporter.sendMail({
    from: `"FoodHub" <web@foodhub.com>`,
    to,
    subject,
    html,
  });
  console.log("Message sent:", info.messageId);
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [
    PUBLIC_APP_URL as string, // PUBLIC_APP_URL=https://khabo.vercel.app
    APP_URL as string,  // APP_URL=http://localhost:3000
  ],
  baseURL: PUBLIC_BETTER_AUTH_URL,  // Backend URL — Better-Auth runs here
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: UserRole.CUSTOMER,
        required: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVATE",
        required: true,
      },
      address: {
        type: "string",
        required: false,
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    // requireEmailVerification: true,
    // sendResetPassword: async ({ user, url, token }, request) => {
    //     void sendEmail({
    //         to: user.email,
    //         subject: "Reset your password",
    //         text: `Click the link to reset your password: ${url}`,
    //     });
    // },
    // onPasswordReset: async ({ user }, request) => {
    //     // your logic here
    //     console.log(`Password for user ${user.email} has been reset.`);
    // },
  },
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account",
      clientId: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
      // Route OAuth callback through the frontend proxy so cookies stay on the
      // same origin. Without this, Better-Auth generates a callback URL using
      // baseURL (backend domain) and the browser can't forward the state cookie.
      redirectURI: `${PUBLIC_APP_URL}/api/auth/callback/google`,
    },
  },
  // emailVerification: {
  //   sendOnSignUp: true,
  //   autoSignInAfterVerification: true,
  //   sendVerificationEmail: async ({ user, url, token }, request) => {
  //     try {
  //       await sendEmail({
  //         to: user.email,
  //         name: user.name,
  //         subject: "Verify your email address",
  //         verificationUrl: url,
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       throw new Error("Failed to send verification email.");
  //     }
  //   },
  // },
});