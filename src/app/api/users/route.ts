import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

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

    const where: any = { firmId: session.firmId }

    if (session.role === 'ADMIN') {
      // Admin sees everyone in the firm except themselves
      where.id = { not: session.id }
    } else if (session.role === 'MANAGING_PARTNER') {
      // Managing Partner sees their assigned team
      where.managingPartnerId = session.id
    } else if (session.role === 'ATTORNEY') {
      // Attorney sees their assigned Paralegals
      where.attorneyId = session.id
    } else {
      // Paralegals are not supposed to access the Users page
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'All') {
      where.isActive = status === 'Active'
    }

    if (role !== 'All') {
      where.role = role
    }

    if (fromDate || toDate) {
      where.createdAt = {}
      if (fromDate) {
        where.createdAt.gte = new Date(fromDate)
      }
      if (toDate) {
        const toD = new Date(toDate)
        toD.setHours(23, 59, 59, 999) // end of the day
        where.createdAt.lte = toD
      }
    }

    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ])

    const totalPages = Math.max(1, Math.ceil(total / limit))

    // Format users for the UI
    const formattedUsers = users.map((u: any) => ({
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

    const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,20}$/;
    if (phone && !phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 })
    }

    if (password && password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    if (session.role === 'ADMIN') {
      // Admin selects role and required hierarchy
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
      // MP can create Attorney or Paralegal
      managingPartnerId = session.id
      if (role === 'ATTORNEY') {
        attorneyId = null;
      } else if (role === 'PARALEGAL') {
        if (!attorneyId) return NextResponse.json({ error: 'Attorney is required' }, { status: 400 })
      }
    } else if (session.role === 'ATTORNEY') {
      // Attorney can only create Paralegals
      role = 'PARALEGAL'
      attorneyId = session.id

      // Need to copy the Attorney's MP ID to the Paralegal
      const currentUser = await prisma.user.findUnique({ where: { id: session.id } })
      managingPartnerId = currentUser?.managingPartnerId || null
    }

    const passwordHash = await bcrypt.hash(password || 'password123', 10)

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        role: role as Role,
        phone,
        managingPartnerId,
        attorneyId,
        firmId: session.firmId,
        passwordHash
      }
    })

    const { passwordHash: _, ...safeUser } = newUser

    try {
      await prisma.auditLog.create({
        data: {
          action: 'USER_CREATED',
          details: `User ${newUser.email} was created with role ${newUser.role}`,
          userId: session.id,
          firmId: session.firmId,
        }
      })
    } catch (e) {
      console.error('Failed to create audit log for user creation:', e)
    }

    return NextResponse.json({ success: true, user: safeUser }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user: [Secure Log]', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 })
    }
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,20}$/;
    if (phone && !phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 })
    }

    if (password && password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    // Role-based permission check: ensure they can edit this user
    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (targetUser.firmId !== session.firmId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (session.role === 'MANAGING_PARTNER') {
      if (targetUser.managingPartnerId !== session.id && targetUser.id !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (session.role === 'ATTORNEY') {
      if (targetUser.attorneyId !== session.id && targetUser.id !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (session.role === 'PARALEGAL') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const dataToUpdate: any = {
      firstName,
      lastName,
      phone,
      managingPartnerId: managingPartnerId || null,
      attorneyId: attorneyId || null
    }

    // Only Admin can change role
    if (session.role === 'ADMIN') {
      dataToUpdate.role = role as Role
    }

    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate
    })

    const { passwordHash: _, ...safeUser } = updatedUser
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

    // Ensure they don't delete themselves
    if (id === session.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    // Find user and ensure they belong to the same firm
    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (targetUser.firmId !== session.firmId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (session.role === 'MANAGING_PARTNER') {
      if (targetUser.managingPartnerId !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (session.role === 'ATTORNEY') {
      if (targetUser.attorneyId !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Delete the user
    await prisma.user.delete({ where: { id } })

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

    // Role-based permission check: ensure they can edit this user
    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (targetUser.firmId !== session.firmId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (session.role === 'MANAGING_PARTNER') {
      if (targetUser.managingPartnerId !== session.id && targetUser.id !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (session.role === 'ATTORNEY') {
      if (targetUser.attorneyId !== session.id && targetUser.id !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (session.role === 'PARALEGAL') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive }
    })

    const { passwordHash: _, ...safeUser } = updatedUser
    return NextResponse.json({ success: true, user: safeUser }, { status: 200 })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
