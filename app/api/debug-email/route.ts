import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function GET() {
  const result: Record<string, unknown> = {};

  // 1. Report what env vars are loaded at request time
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  result.GMAIL_USER_loaded = !!gmailUser;
  result.GMAIL_USER_value = gmailUser ?? '(missing)';
  result.GMAIL_APP_PASSWORD_loaded = !!gmailPass;
  // Show length and last 4 chars only (not the full secret)
  result.GMAIL_APP_PASSWORD_length = gmailPass?.length ?? 0;
  result.GMAIL_APP_PASSWORD_last4 = gmailPass ? gmailPass.slice(-4) : '(missing)';
  result.GMAIL_APP_PASSWORD_has_spaces = gmailPass ? gmailPass.includes(' ') : false;

  // 2. Build a fresh transporter at request time (not module level)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  // 3. Run transporter.verify()
  try {
    await transporter.verify();
    result.verify = 'PASSED — SMTP connection and authentication succeeded';
  } catch (err: any) {
    result.verify = 'FAILED';
    result.verifyError = {
      message: err?.message,
      code: err?.code,
      responseCode: err?.responseCode,
      response: err?.response,
      stack: err?.stack?.split('\n').slice(0, 5),
    };
  }

  return NextResponse.json(result, { status: 200 });
}
