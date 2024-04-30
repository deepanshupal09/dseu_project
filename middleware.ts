import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { useEffect } from "react";
import { parseJwt } from "./app/actions/utils";

const protectedRoutes = ["/dashboard", "/exam-registration"];
const adminRoutes = ["/admin/dashboard","/admin/registration-chart","/admin/admit-card","/admin/query"] ;
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);
  const cookie = await parseJwt(cookies().get("auth")?.value);
  const adminCookie = await parseJwt(cookies().get("admin")?.value);
  const signUpCookie =  (cookies().get("signup")?.value);


  if(isAdminRoute && !adminCookie) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }


  if ((path === "/admin" || path==="/") && (adminCookie||cookie)) {
    return NextResponse.redirect(new URL("/admin/dashboard",req.nextUrl)) 
  }

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  if (isPublicRoute && cookie) {
    return NextResponse.redirect(new URL("/dashboard",req.nextUrl)) 
  }

  
  if (path.startsWith("/getuserdetails") && !signUpCookie ) {
    console.log("redirect f from here")
    return NextResponse.redirect(new URL("/",req.nextUrl)) 
  }


  return NextResponse.next();
}
