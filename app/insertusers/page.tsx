"use client"
import { useEffect } from "react"
import { addUsers } from "../actions/apicall"

export default function Insert() {
    console.log("insert found")
    useEffect(()=>{
        console.log("useEffect called")
        addUsers();
    },[])
    return <div>About</div>
  }