import { NextResponse } from 'next/server';

// Đường dẫn trang đăng nhập
const LOGIN_PATH = '/auth/login';

// Các đường dẫn công khai không cần đăng nhập
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/_next',   // Cho phép tài nguyên Next.js
  '/api',     // Cho phép API routes
  '/favicon.ico',
  '/images',  // Cho phép tài nguyên hình ảnh
];

// Kiểm tra xem đường dẫn có thuộc danh sách công khai không
const isPublicPath = (path) => {
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Cho phép truy cập vào đường dẫn công khai
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // Kiểm tra token trong cookie
  const token = request.cookies.get('admin_token')?.value;
  
  // Nếu không có token, chuyển hướng đến trang đăng nhập
  if (!token) {
    const url = new URL(LOGIN_PATH, request.url);
    // Lưu đường dẫn hiện tại vào tham số redirect để sau khi đăng nhập quay lại
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Nếu có token, cho phép tiếp tục
  return NextResponse.next();
}

// Cấu hình middleware chỉ hoạt động trên các đường dẫn cụ thể
export const config = {
  matcher: [
    // Tất cả các đường dẫn trừ các đường dẫn công khai
    '/((?!auth/login|auth/forgot-password|auth/reset-password|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 