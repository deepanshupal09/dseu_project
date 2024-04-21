import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard", "/getuserdetails"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const cookie = cookies().get("auth")?.value;
  const signUpCookie = cookies().get("signup")?.value;

  // console.log("cookie: ", cookie)

  

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  if (isPublicRoute && cookie) {
    return NextResponse.redirect(new URL("/dashboard",req.nextUrl)) 
  }
  
  if (path.startsWith("/getuserdetails") && !signUpCookie ) {
    return NextResponse.redirect(new URL("/",req.nextUrl)) 
  }

  // if (cookie && req.nextUrl.pathname.startsWith("")) {
  //   console.log("redirect from here");
  //   return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  // }

  // if (
  //   isPublicRoute &&
  //   cookie &&
  //   isPublicRoute
  // ) {
  //   return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  // }

  return NextResponse.next();
}

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }
