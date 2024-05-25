import { NextResponse, type NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log({ request });
  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: ['/graphql/:path*']
};
