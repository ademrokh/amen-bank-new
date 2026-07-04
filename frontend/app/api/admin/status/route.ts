import { NextResponse } from 'next/server';
import { checkAdminStatus } from '../helpers';

export async function GET(request: Request) {
  const isAdmin = await checkAdminStatus(request);
  return NextResponse.json({ isAdmin });
}