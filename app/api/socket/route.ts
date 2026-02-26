import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message:
      'Socket endpoint is not available in Vercel serverless mode. Point NEXT_PUBLIC_SOCKET_URL to a Node server running server.js (Render/Railway/VM).',
  });
}
