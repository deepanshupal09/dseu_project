import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { useEffect } from "react";
import { parseJwt } from "./app/actions/utils";

const userRoutes = ["/dashboard", "/exam-registration", "/profile", "/result","/help"];
const adminRoutes = [
  "/admin/dashboard",
  "/admin/registration-chart",
  "/admin/admit-card",
  "/admin/query",
];
const superAdminRoutes = [
  "/admin/dashboard",
  "/admin/registration-chart",
  "/admin/admit-card",
  "/admin/query",
  "/admin/exam-control",
  "/admin/marks-entry",
  "/admin/marks-control",
  "/admin/marks-status",
  "/admin/edit-student-details",
  "/admin/result-control",
  "/admin/student-result",
  "/admin/results",
  "/admin/download-all-marks"
];
const modRoutes = [
  "/admin/dashboard",
  "/admin/edit-student-details",  
  "/admin/download-all-marks",
  "/admin/student-result"
];
const publicRoutes = ["/", "/admin","/getuserdetails"];
const departmentRoutes = ["/admin/marks-entry"];
const blockedRoutes = ["/getuserdetails"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isUserRoutes = userRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);
  const isSuperAdminRoute = superAdminRoutes.includes(path);
  const isDepartmentRoute = departmentRoutes.includes(path);
  const isModRoute = modRoutes.includes(path);
  const isBlockedRoute = blockedRoutes.includes(path);
  const cookie = (await parseJwt(cookies().get("auth")?.value))?.user;
  const adminCookie = (await parseJwt(cookies().get("admin")?.value))?.user;
  const signUpCookie = cookies().get("signup")?.value;

  // console.log("signup: ",signUpCookie)
  // console.log("middleware: ", path.startsWith("/getuserdetails"), path)

  if(path.startsWith("/getuserdetails") && !signUpCookie) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  if(signUpCookie && path.startsWith("/getuserdetails") ) {
    return NextResponse.next();
  }

  if (!cookie && !adminCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (cookie && !isUserRoutes) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  
  if(adminCookie && adminCookie.role==='dep' && !isDepartmentRoute) {
    return NextResponse.redirect(new URL("/admin/marks-entry", req.nextUrl));
  }
  
  if(adminCookie && adminCookie.role==='admin' && !isAdminRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
  }
  
  if(adminCookie && adminCookie.role==='super' && !isSuperAdminRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
  }

  if(adminCookie && adminCookie.role==='mod' && !isModRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin",
    "/dashboard",
    "/profile",
    "/exam-registration",
    "/result",
    "/help",
    "/admin/dashboard",
    "/admin/exam-control",
    "/admin/admit-card",
    "/admin/registration-chart",
    "/admin/query",
    "/admin/marks-control",
    "/admin/marks-entry",
    "/admin/result-control",
    "/getuserdetails/:rollno*",
    "/admin/results",
    "/admin/student-result",
    "/admin/download-all-marks"
  ],
};
