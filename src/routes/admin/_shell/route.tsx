import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/_shell")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
    return { adminUser: data.user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { adminUser } = Route.useRouteContext();
  return (
    <AdminShell email={adminUser.email ?? ""}>
      <Outlet />
    </AdminShell>
  );
}
