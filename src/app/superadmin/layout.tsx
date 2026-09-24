import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import SuperadminSidebar from "@/components/SuperadminSidebar"
import Header from "@/components/Header"
import IdleTimeoutProvider from "@/components/IdleTimeoutProvider"

export default async function SuperadminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  // Prevent non-superadmin access (SUPERADMIN must be defined in auth roles, default redirect otherwise)
  // For now, if role is not SUPERADMIN we could redirect to / but let's assume session.role === 'SUPERADMIN' 
  // is going to be set up.
  if (session.role !== 'SUPERADMIN') redirect('/')

  return (
    <IdleTimeoutProvider timeoutInMinutes={30}>
      <div className="min-h-screen bg-slate-100 flex font-sans">
        <div className="sticky top-0 h-screen shrink-0 z-50">
          <SuperadminSidebar
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
