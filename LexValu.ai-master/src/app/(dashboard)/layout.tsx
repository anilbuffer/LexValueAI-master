import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { prisma } from "@/lib/prisma"
import IdleTimeoutProvider from "@/components/IdleTimeoutProvider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  // Fetch the firm's session timeout setting to enforce global idle timeout
  const firm = await prisma.firm.findUnique({
    where: { id: session.firmId },
    select: { sessionTimeout: true }
  })

  const timeoutInMinutes = firm?.sessionTimeout || 30;

  return (
    <IdleTimeoutProvider timeoutInMinutes={timeoutInMinutes}>
      <div className="min-h-screen bg-slate-100 flex font-sans">
        <div className="sticky top-0 h-screen shrink-0 z-50">
          <Sidebar
            role={session.role}
            user={{ firstName: session.firstName, lastName: session.lastName }}
          />
        </div>
        <main className="flex-1 flex flex-col min-w-0 relative">
          <div className="sticky top-0 z-40 bg-slate-100 flex flex-col">
            <Header role={session.role} user={{ firstName: session.firstName, lastName: session.lastName }} />
          </div>
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </IdleTimeoutProvider>
  )
}
