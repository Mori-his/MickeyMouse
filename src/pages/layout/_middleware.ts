import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  return NextResponse.next();
}