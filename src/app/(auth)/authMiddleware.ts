'use client'
import { useCurrentUser } from "@/services/queryes"
import { useEffect } from "react"

export const Verify = ()=>{
    const {data: user} = useCurrentUser()
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(!token || !user){
            // redirect to login
            window.location.href = "/login"
        }
    }, [user])
    return true
}