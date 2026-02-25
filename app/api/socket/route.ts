import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Socket endpoint is served by custom server.js on /socket.io',
  });
}
