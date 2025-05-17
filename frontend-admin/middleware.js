import { NextResponse } from 'next/server';

// Login page path
const LOGIN_PATH = '/auth/login';

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/unauthorized',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/_next',   // Allow Next.js resources
  '/api',     // Allow API routes
  '/favicon.ico',
  '/images',  // Allow image resources
];

// Check if a path belongs to the public paths list
const isPublicPath = (path) => {
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Allow access to public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // Check token in cookie
  const token = request.cookies.get('admin_token')?.value;
  
  // If no token, redirect to login page
  if (!token) {
    const url = new URL(LOGIN_PATH, request.url);
    // Store current path in redirect parameter to return after login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If token exists, allow the request to proceed
  return NextResponse.next();
}

// Configure middleware to only run on specific paths
export const config = {
  matcher: [
    // All paths except public paths
    '/((?!auth/login|auth/unauthorized|auth/forgot-password|auth/reset-password|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 