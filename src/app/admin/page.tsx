import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AppHeader } from "@/components/layout/AppHeader"
import { AccountsTable } from "@/components/admin/AccountsTable"

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (!session.user.isAdmin) redirect("/app")

  return (
    <div className="min-h-screen bg-dark-noise">
      <AppHeader user={session.user} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="glass-card rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
          <AccountsTable currentUserId={session.user.id} />
        </div>
      </main>
    </div>
  )
}
