'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
export default function Login(){


    let [id,setId] = useState()
    let [pwd,setPwd] = useState()
    let now = new Date()
    let router = useRouter()

    return (

        <div className="login-container">
            <label>아이디</label>
            <input type="text" name="id" placeholder="아이디를 입력하세요" onChange={(e) => setId(e.target.value)}/>
            <label>비밀번호</label>
            <input type="password" name="pwd" placeholder="비밀번호를 입력하세요" onChange={(e) => setPwd(e.target.value)}/>
            <button onClick={() => {
            }}>LOGIN</button>
        </div>
    )
}