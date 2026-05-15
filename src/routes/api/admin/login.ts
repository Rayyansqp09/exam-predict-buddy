import { createFileRoute } from "@tanstack/react-router";
import { createAdminSetCookieHeader, verifyAdminPassword } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const password = String((body as { password?: unknown })?.password ?? "");

          if (!verifyAdminPassword(password)) {
            return Response.json(
              { success: false, message: "Invalid password" },
              { status: 401 },
            );
          }

          return Response.json(
            { success: true },
            {
              headers: {
                "Set-Cookie": createAdminSetCookieHeader(),
              },
            },
          );
        } catch (error) {
          console.error(error);
          return Response.json(
            { success: false, message: "Login failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});