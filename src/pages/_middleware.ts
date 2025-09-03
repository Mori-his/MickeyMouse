import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // const accessToken = req.cookies['token'];

  // TODO: 登录鉴权
  // if (!accessToken && req.url !== '/login') {
  //   return NextResponse.redirect('/login');
  // }

  return NextResponse.next();
}