import { rotateAdminPasswordEntry } from '../../helpers';

const ADMIN_ID_MAP = {
  adminamenbank: 'b2e91d6d-d391-408a-a6bc-61f575eaf375',
} as const;

export function resolveAdminUserId(usernameOrUserId?: string | null): string | null {
  if (!usernameOrUserId) {
    return null;
  }

  return ADMIN_ID_MAP[usernameOrUserId as keyof typeof ADMIN_ID_MAP] ?? usernameOrUserId;
}

export async function rotateAdminPassword(userId: string) {
  const password = await rotateAdminPasswordEntry(userId);
  return { password };
}
