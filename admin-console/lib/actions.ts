'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { apiFetch, getApiUrl } from './api';
import type { Listing, LoginResponse, CreateListingData } from './types';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const data = await apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

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

export async function createListingAction(data: CreateListingData): Promise<Listing> {
  const listing = await apiFetch<Listing>('/api/admin/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  revalidatePath('/listings');
  return listing;
}

export async function updateListingAction(id: string, data: CreateListingData): Promise<Listing> {
  const listing = await apiFetch<Listing>(`/api/admin/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  revalidatePath('/listings');
  revalidatePath(`/listings/${id}/edit`);
  return listing;
}

export async function deleteListingAction(id: string) {
  await apiFetch(`/api/admin/listings/${id}`, { method: 'DELETE' });
  revalidatePath('/listings');
}

export async function toggleStatusAction(id: string, status: string) {
  await apiFetch(`/api/admin/listings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  revalidatePath('/listings');
}

export async function uploadImagesAction(listingId: string, formData: FormData) {
  const token = (await cookies()).get('auth_token')?.value;
  const apiUrl = getApiUrl();

  const res = await fetch(`${apiUrl}/api/admin/listings/${listingId}/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || 'Upload failed');
  }

  revalidatePath(`/listings/${listingId}/edit`);
  return res.json();
}

export async function deleteImageAction(imageId: number) {
  await apiFetch(`/api/admin/images/${imageId}`, { method: 'DELETE' });
}

export async function setPrimaryImageAction(imageId: number) {
  await apiFetch(`/api/admin/images/${imageId}/primary`, { method: 'PATCH' });
}
