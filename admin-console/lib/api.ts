'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiError, getApiUrl } from './api-error';

const API_URL = getApiUrl();

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(
      'Could not reach the server. Please check your connection and try again.',
      0,
      'NETWORK_ERROR',
    );
  }

  if (res.status === 401) {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    redirect('/login');
  }

  if (!res.ok) {
    let body: { error?: string; code?: string; details?: Record<string, string> };
    try {
      body = await res.json();
    } catch {
      body = { error: res.statusText };
    }
    throw new ApiError(
      body.error || `Request failed (${res.status})`,
      res.status,
      body.code || 'UNKNOWN',
      body.details,
    );
  }

  return res.json();
}
