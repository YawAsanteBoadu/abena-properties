// App Router Route Handler: https://nextjs.org/docs/app/api-reference/file-conventions/route
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ name: 'John Doe' });
}
