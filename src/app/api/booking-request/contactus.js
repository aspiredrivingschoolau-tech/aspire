function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export function getContactusHtml(booking) {
  const rows = [
    ["Email", booking.email],
    ["Phone", booking.phone],
    ["Lesson", booking.lesson],
    ["Preferred day", booking.day],
    ["Preferred time", booking.time],
    ["Pickup address", booking.pickupAddress],
    ["Contact preference", booking.contactPreference],
    ["Notes", booking.notes],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <th align="left" style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(label)}</th>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aspire Driving School - Request Received</title>
</head>
<body style="margin:0;padding:24px 12px;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#172b45;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">

<!-- Header -->
<tr>
<td align="center" style="background:#102d50;padding:36px 24px;">

<img src="cid:aspire-logo" width="140"
alt="Aspire Driving School"
style="display:block;width:140px;height:auto;margin:0 auto 20px;">

<h1 style="margin:0;color:#ffffff;font-size:26px;">
Request Received!
</h1>

<p style="margin:12px 0 0;color:#dce8f5;font-size:14px;">
Thank you for choosing Aspire Driving School
</p>

</td>
</tr>

<!-- Main Content -->
<tr>
<td style="padding:32px 28px;">

<h2 style="margin:0 0 18px;font-size:21px;color:#172b45;">
Hello ${escapeHtml(booking.name)},
</h2>

<p style="font-size:15px;line-height:1.8;color:#526579;">
Thank you for contacting Aspire Driving School.
We've successfully received your lesson request.
</p>

<p style="font-size:15px;line-height:1.8;color:#526579;">
Our team will review your details and get in touch
using your preferred contact method.
</p>

<!-- Booking Details -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
style="background:#f0f6fc;border-radius:8px;margin:26px 0;border-collapse:collapse;">

<tr>
<td colspan="2" style="padding:18px 20px 12px;font-size:17px;font-weight:bold;color:#102d50;">
Your Booking Details
</td>
</tr>

${rows}

</table>

<!-- Notice -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
style="background:#fff8e8;border-radius:8px;">
<tr>
<td style="padding:16px 18px;">
<p style="margin:0 0 8px;font-weight:bold;color:#8a5b13;font-size:14px;">
Important Notice
</p>
<p style="margin:0;color:#76531a;font-size:13px;line-height:1.7;">
Your lesson is not confirmed yet. Your booking will be
confirmed once Gaurav has checked availability and contacted you.
</p>
</td>
</tr>
</table>

<p style="font-size:15px;line-height:1.8;color:#526579;margin-top:26px;">
We look forward to helping you become a confident and safe driver!
</p>

<p style="font-size:14px;line-height:1.8;color:#526579;">
Kind regards,<br>
<strong style="color:#102d50;">Aspire Driving School Team</strong>
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center" style="padding:24px;background:#f4f7fa;border-top:1px solid #e5eaf0;">

<p style="margin:0 0 8px;font-size:15px;font-weight:bold;color:#102d50;">
Aspire Driving School
</p>

<p style="margin:0 0 12px;font-size:12px;color:#718096;">
Canberra, ACT, Australia
</p>

<p style="margin:0;font-size:11px;color:#98a4b3;">
© 2026 Aspire Driving School. All rights reserved.
</p>

</td>
</tr>

</table>
</td>
</tr>
</table>

</body>
</html>
`;
}
