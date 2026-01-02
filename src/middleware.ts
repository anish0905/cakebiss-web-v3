import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Agar user logged in nahi hai aur protected route par hai
    if (!token && (path.startsWith("/admin") || path.startsWith("/cart/checkout"))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2. Agar user logged in hai lekin admin nahi hai aur admin route par ja raha hai
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      // Isse ye ensure hota hai ki middleware hamesha execute ho
      authorized: ({ token }) => true, 
    },
  }
);

export const config = { 
  matcher: ["/admin/:path*", "/cart/checkout", "/profile/:path*"] 
};