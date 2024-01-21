import { NextResponse } from 'next/server';
  
export const config = {
  matcher: ['/:slug(\\d{13})'],
};
 
export default function middleware(request) {
  const url = new URL(request.url);

  url.pathname = '/api/tickets' + url.pathname;
 
  return NextResponse.redirect(url.href);
}