import { createFileRoute } from "@tanstack/react-router";
import { createAdminClearCookieHeader } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async () => {
        return Response.json(
          { success: true },
          {
            headers: {
              "Set-Cookie": createAdminClearCookieHeader(),
            },
          },
        );
      },
    },
  },
});