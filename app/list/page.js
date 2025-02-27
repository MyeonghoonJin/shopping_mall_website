'use client'
import { useEffect, useState } from "react"

export default function List(){


    let [user,setUser] = useState({})

    useEffect(() => {

        let sessionId = localStorage.getItem('sessionId')
        if(sessionId){
            sessionId = JSON.parse(sessionId).value
        }
        fetch('api/auth/session?sessionId='+sessionId)
        .then(r => r.json())
        .then((user) => {
            setUser(user)
        })
    },[])

    
    return(
        <div>
            <p>현재 세션 유저 email : {user ? user.email : ''}</p>
        </div>
    )
}