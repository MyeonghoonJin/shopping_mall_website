'use client'
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LogoutBtn() {

    let router = useRouter()

    return(
        <div>
            <button onClick={() => {
                signOut()
            }}>LOGOUT</button>
        </div>
    )
}

