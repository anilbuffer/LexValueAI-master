import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ReportsClient } from "./ReportsClient"

export default async function ReportsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const isManagingPartner = session.role === 'MANAGING_PARTNER';
  const isAdmin = session.role === 'ADMIN';

  return (
    <div className="w-full p-2.5 pb-[15px] font-sans relative flex flex-col gap-[15px]">
      <ReportsClient isManagingPartner={isManagingPartner} isAdmin={isAdmin} />
    </div>
  )
}
