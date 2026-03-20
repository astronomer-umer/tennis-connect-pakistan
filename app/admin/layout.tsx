import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Building2, Calendar, Table2, MessageSquare, UserCog, LogOut } from "lucide-react";
import { requireAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = await requireAdminAuth();

  if (!isAuthorized) {
    redirect("/admin-login");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-brand">🎾 Admin Panel</h1>
            <p className="text-xs text-gray-400">Tennis Connect Pakistan</p>
          </div>
          
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-700 text-white">
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link href="/admin/courts" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700">
              <Building2 size={20} />
              Courts
            </Link>
            <Link href="/admin/players" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700">
              <Users size={20} />
              Players
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700">
              <Calendar size={20} />
              Bookings
            </Link>
            <Link href="/admin/tables" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700">
              <Table2 size={20} />
              Table Showcase
            </Link>
            <Link href="/admin/contacts" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700">
              <MessageSquare size={20} />
              Contacts
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700">
              <UserCog size={20} />
              Users
            </Link>
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-700">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700">
              <LogOut size={20} />
              Back to App
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
