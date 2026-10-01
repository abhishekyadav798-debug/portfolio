const { Resend } = require('resend');

// Lazy init — server won't crash if RESEND_API_KEY is missing
function getResend() {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_placeholder')) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = 'Abhishek Yadav Portfolio <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Send confirmation to client after project request
async function sendRequestConfirmation(toEmail, clientName, requestId) {
  const resend = getResend(); if (!resend) { console.log('[Email] Skipped - no API key'); return; }
  await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `✅ Project Request Received – ${requestId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #e0e0e0; margin:0; padding:0;">
        <div style="max-width:600px; margin:40px auto; background: linear-gradient(135deg, #111827, #1f2937); border-radius:16px; overflow:hidden; border:1px solid rgba(99,102,241,0.3);">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding:40px 30px; text-align:center;">
            <h1 style="color:#fff; margin:0; font-size:28px; font-weight:700;">Request Received! 🚀</h1>
            <p style="color:rgba(255,255,255,0.85); margin:10px 0 0; font-size:16px;">Your project request has been submitted successfully</p>
          </div>
          <div style="padding:40px 30px;">
            <p style="color:#d1d5db; font-size:16px; line-height:1.6;">Hi <strong style="color:#a78bfa;">${clientName}</strong>,</p>
            <p style="color:#d1d5db; font-size:15px; line-height:1.6;">Thank you for reaching out! I've received your project request and will review it within <strong style="color:#6366f1;">24 hours</strong>.</p>

            <div style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.3); border-radius:12px; padding:24px; margin:24px 0; text-align:center;">
              <p style="margin:0 0 8px; color:#9ca3af; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Your Request ID</p>
              <h2 style="margin:0; color:#a78bfa; font-size:32px; font-weight:800; letter-spacing:2px;">${requestId}</h2>
              <p style="margin:12px 0 0; color:#6b7280; font-size:12px;">Save this ID to track your project status</p>
            </div>

            <div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:20px; margin:20px 0;">
              <h3 style="color:#e0e0e0; margin:0 0 16px; font-size:15px;">What happens next?</h3>
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <span style="background:#6366f1; color:#fff; border-radius:50%; width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">1</span>
                  <span style="color:#d1d5db; font-size:14px;">I'll review your requirements carefully</span>
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                  <span style="background:#8b5cf6; color:#fff; border-radius:50%; width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">2</span>
                  <span style="color:#d1d5db; font-size:14px;">We'll schedule a discussion call/chat</span>
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                  <span style="background:#a855f7; color:#fff; border-radius:50%; width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">3</span>
                  <span style="color:#d1d5db; font-size:14px;">You'll receive a detailed quotation</span>
                </div>
              </div>
            </div>

            <p style="color:#9ca3af; font-size:14px; line-height:1.6;">Track your request anytime at: <a href="${process.env.FRONTEND_URL}/track" style="color:#6366f1;">abhishek.dev/track</a></p>

            <div style="margin-top:32px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.1); text-align:center;">
              <p style="color:#6b7280; font-size:13px; margin:0;">— Abhishek Yadav</p>
              <p style="color:#6b7280; font-size:12px; margin:4px 0 0;">Software Engineer | Full-Stack Developer</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  });
}

// Notify admin of new project request
async function sendAdminNotification(requestData, requestId) {
  const resend = getResend(); if (!resend) { console.log('[Email] Skipped - no API key'); return; }
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `🔔 New Project Request: ${requestId} – ${requestData.projectType}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background:#0a0a0a; color:#e0e0e0; padding:20px;">
        <div style="max-width:600px; margin:0 auto; background:#111827; border-radius:12px; padding:32px; border:1px solid rgba(99,102,241,0.3);">
          <h2 style="color:#a78bfa; margin-top:0;">New Project Request Received</h2>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:8px 0; color:#9ca3af; font-size:14px; border-bottom:1px solid #1f2937;">Request ID</td><td style="padding:8px 0; color:#e0e0e0; font-weight:700;">${requestId}</td></tr>
            <tr><td style="padding:8px 0; color:#9ca3af; font-size:14px; border-bottom:1px solid #1f2937;">Client Name</td><td style="padding:8px 0; color:#e0e0e0;">${requestData.name}</td></tr>
            <tr><td style="padding:8px 0; color:#9ca3af; font-size:14px; border-bottom:1px solid #1f2937;">Email</td><td style="padding:8px 0; color:#e0e0e0;">${requestData.email}</td></tr>
            <tr><td style="padding:8px 0; color:#9ca3af; font-size:14px; border-bottom:1px solid #1f2937;">Phone</td><td style="padding:8px 0; color:#e0e0e0;">${requestData.phone || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0; color:#9ca3af; font-size:14px; border-bottom:1px solid #1f2937;">Project Type</td><td style="padding:8px 0; color:#6366f1; font-weight:700;">${requestData.projectType}</td></tr>
            <tr><td style="padding:8px 0; color:#9ca3af; font-size:14px; border-bottom:1px solid #1f2937;">Budget</td><td style="padding:8px 0; color:#10b981;">${requestData.budget}</td></tr>
            <tr><td style="padding:8px 0; color:#9ca3af; font-size:14px; border-bottom:1px solid #1f2937;">Deadline</td><td style="padding:8px 0; color:#e0e0e0;">${requestData.deadline || 'Not specified'}</td></tr>
          </table>
          <div style="margin-top:20px; background:rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
            <p style="color:#9ca3af; font-size:13px; margin:0 0 8px;">Description:</p>
            <p style="color:#e0e0e0; font-size:14px; margin:0; line-height:1.6;">${requestData.description}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/admin/requests" style="display:inline-block; margin-top:24px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">View in Admin Panel →</a>
        </div>
      </body>
      </html>
    `
  });
}

// Send contact form reply notification
async function sendContactConfirmation(toEmail, clientName, subject) {
  const resend = getResend(); if (!resend) { console.log('[Email] Skipped - no API key'); return; }
  await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `✉️ Message Received – Abhishek Yadav`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background:#0a0a0a; color:#e0e0e0; padding:20px;">
        <div style="max-width:600px; margin:0 auto; background:#111827; border-radius:12px; padding:32px; border:1px solid rgba(99,102,241,0.3);">
          <h2 style="color:#a78bfa; margin-top:0;">Message Received! ✉️</h2>
          <p style="color:#d1d5db;">Hi <strong>${clientName}</strong>,</p>
          <p style="color:#d1d5db; line-height:1.6;">Thank you for your message regarding "<strong>${subject}</strong>". I've received it and will reply within <strong>24 hours</strong>.</p>
          <p style="color:#9ca3af; font-size:13px; margin-top:24px;">— Abhishek Yadav | Software Engineer</p>
        </div>
      </body>
      </html>
    `
  });
}

async function sendAdminContactNotification(contactData) {
  const resend = getResend(); if (!resend) { console.log('[Email] Skipped - no API key'); return; }
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `📩 New Contact Message: ${contactData.subject}`,
    html: `
      <div style="font-family:Arial;background:#0a0a0a;color:#e0e0e0;padding:20px;">
        <div style="max-width:600px;margin:0 auto;background:#111827;border-radius:12px;padding:32px;border:1px solid rgba(99,102,241,0.3);">
          <h2 style="color:#a78bfa;">New Contact Message</h2>
          <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:16px;margin-top:16px;">
            <p style="color:#d1d5db;line-height:1.6;">${contactData.message}</p>
          </div>
        </div>
      </div>
    `
  });
}

module.exports = {
  sendRequestConfirmation,
  sendAdminNotification,
  sendContactConfirmation,
  sendAdminContactNotification
};
