import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET || 'lexvalue-super-secret-jwt-key'
const key = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
  firmId: string
}

export async function encrypt(payload: SessionPayload, expiresIn: string = '24h') {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key)
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch (_) {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('lexvalue-auth')?.value

  if (!token) return null

  const payload = await decrypt(token)
  if (!payload) return null

  // Security: Check if user still exists in the database
  // This ensures deleted users are immediately logged out
  const { prisma } = await import('@/lib/prisma')
  const user = await prisma.user.findUnique({
    where: { id: payload.id }
  })

  if (!user || !user.isActive) return null

  return payload
}
