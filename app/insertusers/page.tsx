"use client"
import { useEffect } from "react"
import { addUsers } from "../actions/apicall"

export default function Insert() {
    useEffect(()=>{
        addUsers();
    },[])
    return <div>About</div>
  }