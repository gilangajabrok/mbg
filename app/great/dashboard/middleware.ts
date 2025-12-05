import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get("role")?.value

  if (userRole !== "superadmin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/great/dashboard/:path*"],
}
