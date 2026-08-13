import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UsersClient } from './UsersClient'

export const dynamic = 'force-dynamic'

export default async function UsersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const session = await getSession()
  if (!session || !session.id) {
    redirect('/login')
  }

  if (session.role === 'PARALEGAL') {
    redirect('/dashboard')
  }

  // Parse searchParams
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1
  const search = typeof searchParams.search === 'string' ? searchParams.search : ''
  const status = typeof searchParams.status === 'string' ? searchParams.status : 'All'
  const role = typeof searchParams.role === 'string' ? searchParams.role : 'All'
  const fromDate = typeof searchParams.fromDate === 'string' ? searchParams.fromDate : ''
  const toDate = typeof searchParams.toDate === 'string' ? searchParams.toDate : ''

  return (
    <UsersClient
      role={session.role}
      initialSearch={search}
      initialPage={page}
      initialRoleFilter={role}
      initialStatusFilter={status}
      initialFromDate={fromDate}
      initialToDate={toDate}
    />
  )
}
