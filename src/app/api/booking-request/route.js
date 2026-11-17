
import path from "node:path";
import nodemailer from "nodemailer";
import { getAppointmentHtml } from "./appointment.js";
import { getContactusHtml } from "./contactus.js";

const CONTACT_PREFERENCES = new Set([
  "WhatsApp",
  "Email",
  "Instagram DM",
  "Either WhatsApp or email",
]);

function readText(body, key, maxLength) {
  const value = body[key];

  if (value === undefined || value === null) return "";

  if (typeof value !== "string" || value.length > maxLength) {
    return null;
  }

  return value.trim();
}

export async function POST(request) {
  try {
    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (contentLength > 12000) {
      return Response.json(
        { error: "The request is too large." },
        { status: 413 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "The request could not be read." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json(
        { error: "The request is invalid." },
        { status: 400 }
      );
    }

    const booking = {
      name: readText(body, "name", 120),
      phone: readText(body, "phone", 40),
      email: readText(body, "email", 254),
      instagramHandle: readText(body, "instagramHandle", 100),
      lesson: readText(body, "lesson", 100),
      day: readText(body, "day", 100),
      time: readText(body, "time", 100),
      pickupAddress: readText(body, "pickupAddress", 500),
      notes: readText(body, "notes", 2000),
      contactPreference: readText(body, "contactPreference", 50),
    };

    if (Object.values(booking).some((value) => value === null)) {
      return Response.json(
        { error: "Please check your entries and try again." },
        { status: 400 }
      );
    }

    if (
      !booking.name ||
      !booking.phone ||
      !booking.lesson ||
      !CONTACT_PREFERENCES.has(booking.contactPreference)
    ) {
      return Response.json(
        { error: "Please complete the required booking details." },
        { status: 400 }
      );
    }

    // Validate email address
    if (
      booking.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)
    ) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (
      (booking.contactPreference === "Email" ||
        booking.contactPreference === "Either WhatsApp or email") &&
      !booking.email
    ) {
      return Response.json(
        { error: "Please enter an email address for your chosen contact method." },
        { status: 400 }
      );
    }

    // Gmail credentials
    const user = process.env.GMAIL_USER;
    const password = process.env.GMAIL_APP_PASSWORD;
    const recipient = process.env.BOOKING_RECIPIENT_EMAIL;

    if (!user || !password || !recipient) {
      console.error("Missing Gmail environment variables.");

      return Response.json(
        { error: "Email service is not configured on the server." },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass: password.replace(/\s/g, ""),
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });

    const details = [
      ["Name", booking.name],
      ["Phone", booking.phone],
      ["Email", booking.email],
      ["Instagram", booking.instagramHandle],
      ["Lesson", booking.lesson],
      ["Preferred day", booking.day],
      ["Preferred time", booking.time],
      ["Pickup address", booking.pickupAddress],
      ["Notes", booking.notes],
      ["Contact preference", booking.contactPreference],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n");

    const logoAttachment = {
      filename: "aspire.jpg",
      path: path.join(process.cwd(), "public", "aspire.jpg"),
      cid: "aspire-logo",
    };

    await transporter.sendMail({
      from: `"Aspire Driving School" <${user}>`,
      to: recipient,
      replyTo: booking.email || undefined,
      subject: "New Driving Lesson Request",
      text: `A new lesson request was submitted to Aspire Driving School.\n\n${details}\n\nThis is a request, not a confirmed lesson.`,
      html: getAppointmentHtml(booking),
      attachments: [logoAttachment],
    });

    let confirmationSent = false;
    if (booking.email) {
      try {
        await transporter.sendMail({
          from: `"Aspire Driving School" <${user}>`,
          to: booking.email,
          replyTo: user,
          subject: "We received your lesson request",
          text: `Hello ${booking.name},\n\nAspire Driving School received your lesson request. Gaurav will follow up using your preferred contact method. This is a request, not a confirmed lesson.\n\n${details}`,
          html: getContactusHtml(booking),
          attachments: [logoAttachment],
        });
        confirmationSent = true;
      } catch (error) {
        console.error("Failed to send learner confirmation email:", error);
      }
    }

    const message = confirmationSent
      ? "Your request was emailed to Gaurav, and a confirmation email was sent to you. This is a request, not a confirmed lesson."
      : booking.email
        ? "Your request was emailed to Gaurav, but we couldn't send a confirmation email to you. This is a request, not a confirmed lesson."
        : "Your request was emailed to Gaurav. Add an email address if you would also like a confirmation email. This is a request, not a confirmed lesson.";

    return Response.json({
      success: true,
      message,
    });

  } catch (error) {
    console.error("Booking email error:", error);

    const authenticationFailed =
      error?.code === "EAUTH" ||
      error?.responseCode === 535;

    return Response.json(
      {
        error: authenticationFailed
          ? "Gmail authentication failed. Check your Gmail App Password."
          : "Email delivery failed. Please try again later or contact Aspire Driving School directly.",
      },
      { status: 502 }
    );
  }
}
