"use server"
import { cookies } from 'next/headers'
 
export async function getAuth() {
  const cookieStore = cookies()
  const auth = cookieStore.get('auth')
//   console.log(auth)
  return auth
}

export async function setAuth(token: string) {
    cookies().set('auth', token , {expires: new Date(Date.now() + 2 * 60 * 60 * 1000) , secure: true })
}

export async function getSignupCookie() {
    const cookieStore = cookies()
    const auth = cookieStore.get('signup')
    console.log(auth)
    return auth
}
export async function setSignupCookie() {
    cookies().set('signup', 'true' , {expires: new Date(Date.now() + 20 * 60 * 1000) , secure: true })
}
export async function deleteSignupCookie() {
    cookies().set('signup', 'true' , {expires: new Date(Date.now() - 1 * 60 * 60 * 1000) , secure: true })
}
export async function deleteAuth() {
    cookies().set('auth', 'false' , {expires: new Date(Date.now() - 1 * 60 * 60 * 1000) , secure: true })
}

export async function getAuthAdmin() {
    const cookieStore = cookies()
    const auth = cookieStore.get('admin')
    return auth
}

export async function setAuthAdmin(token: string) {
    cookies().set('admin', token , {expires: new Date(Date.now() + 2 * 60 * 60 * 1000) , secure: true })
}

export async function deleteAuthAdmin() {
    cookies().set('admin', 'false' , {expires: new Date(Date.now() - 1 * 60 * 60 * 1000) , secure: true })
}




