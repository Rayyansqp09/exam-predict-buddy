import { createFileRoute } from "@tanstack/react-router";
import nodemailer from "nodemailer";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const name = String(body.name ?? "").trim();
          const email = String(body.email ?? "").trim();
          const subject = String(body.subject ?? "").trim();
          const message = String(body.message ?? "").trim();

          if (!name || !email || !subject || !message) {
            return Response.json(
              { success: false, message: "All fields are required" },
              { status: 400 },
            );
          }

          const smtpHost = process.env.SMTP_HOST;
          const smtpPort = Number(process.env.SMTP_PORT ?? "587");
          const smtpUser = process.env.SMTP_USER;
          const smtpPass = process.env.SMTP_PASS;
          const contactEmail = process.env.CONTACT_EMAIL;

          if (!smtpHost || !smtpUser || !smtpPass || !contactEmail) {
            return Response.json(
              { success: false, message: "Mail server not configured" },
              { status: 500 },
            );
          }

          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          await transporter.sendMail({
            from: `"FYUGP Hub Contact" <${smtpUser}>`,
            to: contactEmail,
            replyTo: email,
            subject: `${subject}`,
            text: [
              `Name: ${name}`,
              `Email: ${email}`,
              "",
              `Subject: ${subject}`,
              "",
              message,
            ].join("\n"),
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>New Message</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
              </div>
            `,
          });

          return Response.json({
            success: true,
            message: "Message sent successfully",
          });
        } catch (error) {
          console.error("CONTACT API ERROR:", error);

          return Response.json(
            {
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : JSON.stringify(error),
            },
            { status: 500 },
          );
        }
      },
    },
  },
});

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}