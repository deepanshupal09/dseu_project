import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { useEffect } from "react";
import { parseJwt } from "./app/actions/utils";

const protectedRoutes = ["/dashboard", "/exam-registration"];
const adminRoutes = ["/admin/dashboard","/admin/registration-chart","/admin/admit-card","/admin/query","/admin/exam-control"] ;
const publicRoutes = ["/"];
const blockedRoutes = ["/getuserdetails","/exam-registration"]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);
  const isBlockedRoute = blockedRoutes.includes(path);
  const cookie = (await parseJwt(cookies().get("auth")?.value))?.user;
  const adminCookie = (await parseJwt(cookies().get("admin")?.value))?.user;
  const signUpCookie =  (cookies().get("signup")?.value);

  // 
  // if(isBlockedRoute) {
  //   return NextResponse.redirect(new URL("/",req.nextUrl));
  // }


  // if(path.startsWith("/getuserdetails")) {
  //   return NextResponse.redirect(new URL("/", req.nextUrl));
  // }

  // 

  if (isAdminRoute && !adminCookie) {
    return NextResponse.redirect(new URL("/",req.nextUrl)) 
  }

  if ((path.startsWith("/admin/exam-control")||path.startsWith("/admin/edit-student-details")) && adminCookie.role !== "super") {
    return NextResponse.redirect(new URL("/",req.nextUrl)) 
  }

  if ((path === "/admin" || path === "/") && adminCookie) {
    return NextResponse.redirect(new URL("/admin/dashboard",req.nextUrl)) 
  }
  if ((path === "/" || path==="/admin")&& cookie) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  if (isPublicRoute && cookie) {
    return NextResponse.redirect(new URL("/dashboard",req.nextUrl)) 
  }

  
  if (path.startsWith("/getuserdetails") && (!signUpCookie || signUpCookie !== 'true') ) {
    // 
    return NextResponse.redirect(new URL("/",req.nextUrl)) 
  }


  return NextResponse.next();
}
