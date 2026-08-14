import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { getMockUsers, createMockUser, updateMockUser, deleteMockUser, createMockAuditLog } from '@/lib/mock-data'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'All'
    const role = searchParams.get('role') || 'All'
    const fromDate = searchParams.get('fromDate') || ''
    const toDate = searchParams.get('toDate') || ''

    const skip = (page - 1) * limit

    let users = getMockUsers().filter(u => u.firmId === session.firmId);

    if (session.role === 'ADMIN') {
      users = users.filter(u => u.id !== session.id)
    } else if (session.role === 'MANAGING_PARTNER') {
      users = users.filter(u => u.managingPartnerId === session.id)
    } else if (session.role === 'ATTORNEY') {
      users = users.filter(u => u.attorneyId === session.id)
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(u => 
        u.firstName.toLowerCase().includes(searchLower) ||
        u.lastName.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }

    if (status !== 'All') {
      const isActive = status === 'Active';
      users = users.filter(u => u.isActive === isActive);
    }

    if (role !== 'All') {
      users = users.filter(u => u.role === role);
    }

    if (fromDate || toDate) {
      if (fromDate) {
        const fromD = new Date(fromDate);
        users = users.filter(u => new Date(u.createdAt) >= fromD);
      }
      if (toDate) {
        const toD = new Date(toDate);
        toD.setHours(23, 59, 59, 999);
        users = users.filter(u => new Date(u.createdAt) <= toD);
      }
    }

    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = users.length;
    const paginatedUsers = users.slice(skip, skip + limit);

    const totalPages = Math.max(1, Math.ceil(total / limit))

    // Format users for the UI
    const formattedUsers = paginatedUsers.map((u: any) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      phone: u.phone,
      role: u.role,
      managingPartnerId: u.managingPartnerId,
      attorneyId: u.attorneyId,
      status: u.isActive ? "Active" : "Inactive",
      joined: new Date(u.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }))

    return NextResponse.json({ success: true, users: formattedUsers, total, totalPages, currentPage: page }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id || session.role === 'PARALEGAL') {
      return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    let { firstName, lastName, email, role, phone, password, managingPartnerId, attorneyId } = body

    if (!firstName || !lastName || !email || !role || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (password && password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    if (session.role === 'ADMIN') {
      if (role === 'MANAGING_PARTNER') {
        managingPartnerId = null;
        attorneyId = null;
      } else if (role === 'ATTORNEY') {
        if (!managingPartnerId) return NextResponse.json({ error: 'Managing Partner is required' }, { status: 400 })
        attorneyId = null;
      } else if (role === 'PARALEGAL') {
        if (!managingPartnerId || !attorneyId) return NextResponse.json({ error: 'Managing Partner and Attorney are required' }, { status: 400 })
      }
    } else if (session.role === 'MANAGING_PARTNER') {
      managingPartnerId = session.id
      if (role === 'ATTORNEY') {
        attorneyId = null;
      } else if (role === 'PARALEGAL') {
        if (!attorneyId) return NextResponse.json({ error: 'Attorney is required' }, { status: 400 })
      }
    } else if (session.role === 'ATTORNEY') {
      role = 'PARALEGAL'
      attorneyId = session.id

      const currentUser = getMockUsers().find(u => u.id === session.id);
      managingPartnerId = currentUser?.managingPartnerId || null
    }
    
    // Check for existing email
    if (getMockUsers().some(u => u.email === email)) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password || 'password123', 10)

    const newUser = createMockUser({
      id: `user-${Date.now()}`,
      firstName,
      lastName,
      email,
      role,
      phone,
      managingPartnerId,
      attorneyId,
      firmId: session.firmId,
      passwordHash,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const { passwordHash: _, ...safeUser } = newUser

    createMockAuditLog({
      id: `log-${Date.now()}`,
      action: 'USER_CREATED',
      details: `User ${newUser.email} was created with role ${newUser.role}`,
      userId: session.id,
      firmId: session.firmId,
      createdAt: new Date()
    })

    return NextResponse.json({ success: true, user: safeUser }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user: [Secure Log]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, firstName, lastName, email, role, phone, managingPartnerId, attorneyId, password } = body

    if (!id || !firstName || !lastName || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const targetUser = getMockUsers().find(u => u.id === id)
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (targetUser.firmId !== session.firmId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const dataToUpdate: any = {
      firstName,
      lastName,
      phone,
      managingPartnerId: managingPartnerId || null,
      attorneyId: attorneyId || null,
      updatedAt: new Date()
    }

    if (session.role === 'ADMIN') {
      dataToUpdate.role = role
    }

    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10)
    }

    const updatedUser = updateMockUser(id, dataToUpdate)
    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    const { passwordHash: _, ...safeUser } = updatedUser as any
    return NextResponse.json({ success: true, user: safeUser }, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id || session.role === 'PARALEGAL') {
      return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (id === session.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    const targetUser = getMockUsers().find(u => u.id === id)
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (targetUser.firmId !== session.firmId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    deleteMockUser(id)

    return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting user: [Secure Log]')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, isActive } = body

    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const targetUser = getMockUsers().find(u => u.id === id)
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (targetUser.firmId !== session.firmId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedUser = updateMockUser(id, { isActive, updatedAt: new Date() })
    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 })
    }

    const { passwordHash: _, ...safeUser } = updatedUser as any
    return NextResponse.json({ success: true, user: safeUser }, { status: 200 })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
