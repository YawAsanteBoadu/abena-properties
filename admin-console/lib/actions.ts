'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { apiFetch, getAuthToken } from './api';
import { ApiError, getApiUrl } from './api-error';
import type { Listing, LoginResponse, CreateListingData } from './types';

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fail(err: unknown): ActionResult<never> {
  if (err instanceof ApiError) {
    return { ok: false, error: err.message, fieldErrors: err.fieldErrors };
  }
  if (err instanceof Error) {
    return { ok: false, error: err.message };
  }
  return { ok: false, error: 'An unexpected error occurred.' };
}

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' };
  }

  let data: LoginResponse;
  try {
    data = await apiFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    return fail(err);
  }

  const cookieStore = await cookies();
  cookieStore.set('auth_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  redirect('/');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/login');
}

export async function createListingAction(data: CreateListingData): Promise<ActionResult<Listing>> {
  try {
    const listing = await apiFetch<Listing>('/api/admin/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    revalidatePath('/listings');
    return { ok: true, data: listing };
  } catch (err) {
    return fail(err);
  }
}

export async function updateListingAction(id: string, data: CreateListingData): Promise<ActionResult<Listing>> {
  try {
    const listing = await apiFetch<Listing>(`/api/admin/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    revalidatePath('/listings');
    revalidatePath(`/listings/${id}/edit`);
    return { ok: true, data: listing };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteListingAction(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/api/admin/listings/${id}`, { method: 'DELETE' });
    revalidatePath('/listings');
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

export async function toggleStatusAction(id: string, status: string): Promise<ActionResult> {
  try {
    await apiFetch(`/api/admin/listings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    revalidatePath('/listings');
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

export async function uploadImagesAction(listingId: string, formData: FormData): Promise<ActionResult<unknown>> {
  try {
    const token = await getAuthToken();
    const apiUrl = getApiUrl();

    const res = await fetch(`${apiUrl}/api/admin/listings/${listingId}/images`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      let body: { error?: string; code?: string };
      try {
        body = await res.json();
      } catch {
        body = { error: res.statusText };
      }
      return { ok: false, error: body.error || `Upload failed (${res.status})` };
    }

    const data = await res.json();
    revalidatePath(`/listings/${listingId}/edit`);
    return { ok: true, data };
  } catch (err) {
    if (err instanceof Error && err.message.includes('fetch')) {
      return { ok: false, error: 'Could not reach the server. Please check your connection and try again.' };
    }
    return fail(err);
  }
}

export async function deleteImageAction(imageId: number): Promise<ActionResult> {
  try {
    await apiFetch(`/api/admin/images/${imageId}`, { method: 'DELETE' });
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

export async function setPrimaryImageAction(imageId: number): Promise<ActionResult> {
  try {
    await apiFetch(`/api/admin/images/${imageId}/primary`, { method: 'PATCH' });
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}
