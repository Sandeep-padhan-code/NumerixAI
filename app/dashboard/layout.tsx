import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { isAuthenticated } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-4 px-3 pb-24 pt-4 lg:pb-4">
      <DashboardSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
