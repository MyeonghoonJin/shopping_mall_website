'use client'
import { useEffect, useState } from "react"

export default function List(){


    let sessionId = localStorage.getItem('sessionId')
    sessionId = JSON.parse(sessionId).value

    let [user,setUser] = useState({})

    useEffect(() => {
        fetch('api/auth/session?sessionId='+sessionId)
        .then(r => r.json())
        .then((user) => {
            setUser(user)
        })
    },[])

    
    return(
        <div>
            <p>현재 세션 유저 email : {user.email}</p>
        </div>
    )
}