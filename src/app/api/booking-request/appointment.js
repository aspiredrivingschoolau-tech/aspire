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

export function getAppointmentHtml(booking) {
  const rows = [
    ["Name", booking.name],
    ["Phone", booking.phone],
    ["Email", booking.email],
    ["Instagram", booking.instagramHandle],
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

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aspire Driving School - New lesson request</title>
  </head>
  <body style="margin:0;padding:24px;background:#f3f6fa;font-family:Arial,sans-serif;color:#10243a">
    <table role="presentation" style="width:100%;max-width:600px;margin:0 auto;border-collapse:collapse;background:#fff">
      <tr>
        <td style="padding:24px;text-align:center;background:#0b2342">
          <img src="cid:aspire-logo" width="140" alt="Aspire Driving School" style="display:block;width:140px;height:auto;margin:0 auto 16px">
          <h1 style="margin:0;color:#fff;font-size:24px">New Lesson Request</h1>
          <p style="margin:10px 0 0;color:#e5edf7">Please contact the learner to confirm availability.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px">
          <p style="line-height:1.6">A learner has requested a lesson. Request details:</p>
          <table role="presentation" style="width:100%;border-collapse:collapse">${rows}</table>
          <p style="margin-top:20px;line-height:1.6;color:#526579">This is a request, not a confirmed lesson.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:18px;text-align:center;background:#f8fafc;border-top:1px solid #e5e7eb;color:#526579;font-size:12px">
          Aspire Driving School · Canberra, ACT
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
