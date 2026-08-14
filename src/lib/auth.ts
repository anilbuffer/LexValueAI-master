import { getMockUser } from './mock-data';

export interface SessionPayload {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
  firmId: string
}

export async function encrypt(payload: SessionPayload, expiresIn: string = '24h') {
  return "mock-token";
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  return null;
}

import { cookies } from 'next/headers';

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('lexvalue-auth');
  const email = authCookie?.value || "harvey@smithassociates.com";

  const { getMockUsers } = await import('./mock-data');
  const users = getMockUsers();
  const user = users.find((u: any) => u.email === email) || users[0];

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    firmId: user.firmId
  };
}
