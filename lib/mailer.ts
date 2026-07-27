import nodemailer from 'nodemailer';

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(`Missing email env vars — GMAIL_USER: ${!!user}, GMAIL_APP_PASSWORD: ${!!pass}`);
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

export async function sendNewOrderEmail({
  orderId,
  customerName,
  customerPhone,
  orderText,
  note,
  photoPath,
}: {
  orderId: number;
  customerName: string;
  customerPhone: string;
  orderText?: string | null;
  note?: string | null;
  photoPath?: string | null;
}) {
  const transporter = createTransporter();
  const to = process.env.GMAIL_USER!;
  const from = `"New Madhav Trading Orders" <${process.env.GMAIL_USER}>`;
  console.log('[EMAIL] Sending new-order notification — from:', from, '| to:', to, '| orderId:', orderId);
  const info = await transporter.sendMail({
    from,
    to,
    subject: `New Order #${orderId} — ${customerName} — ${customerPhone}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #1A3A6B;">New Order #${orderId}</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${customerName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${customerPhone}</td></tr>
          ${orderText ? `<tr><td style="padding: 8px; font-weight: bold;">Order</td><td style="padding: 8px;">${orderText}</td></tr>` : ''}
          ${note ? `<tr><td style="padding: 8px; font-weight: bold;">Note</td><td style="padding: 8px;">${note}</td></tr>` : ''}
          ${photoPath ? `<tr><td style="padding: 8px; font-weight: bold;">Photo</td><td style="padding: 8px;">Uploaded — view in admin dashboard</td></tr>` : ''}
        </table>
        <br/>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin" 
           style="background:#1A3A6B; color:white; padding:10px 20px; text-decoration:none; border-radius:6px;">
          Open Admin Dashboard →
        </a>
      </div>
    `,
  });
  console.log('[EMAIL] new-order email sent successfully. messageId:', info.messageId);
}

export async function sendOrderReadyEmail({
  orderId,
  customerEmail,
}: {
  orderId: number;
  customerEmail: string;
}) {
  const transporter = createTransporter();
  const from = `"New Madhav Trading" <${process.env.GMAIL_USER}>`;
  console.log('[EMAIL] Sending order-ready email — from:', from, '| to:', customerEmail, '| orderId:', orderId);
  const info = await transporter.sendMail({
    from,
    to: customerEmail,
    subject: `Your Order #${orderId} is Ready — New Madhav Trading`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #1A3A6B;">Your order is ready!</h2>
        <p>Order <strong>#${orderId}</strong> is ready for pickup.</p>
        <p><strong>Address:</strong> 26, Kailash Nagar, Tapovan Circle, Chikuwadi, Nana Varachha, Surat</p>
        <p><strong>Phone:</strong> +91 98245 35155</p>
      </div>
    `,
  });
  console.log('[EMAIL] order-ready email sent successfully. messageId:', info.messageId);
}
