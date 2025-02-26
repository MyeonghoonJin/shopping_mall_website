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
                fetch('/api/auth/login',{
                    method : 'POST',
                    body : JSON.stringify({
                        id : id,
                        pwd : pwd
                    })
                })
                .then(r => {
                    if(r.status == 400){
                        alert('아이디 또는 비밀번호가 정확하지 않습니다!')
                        router.refresh()
                        return
                    }
                    else if(r.status == 500){
                        alert('서버 오류로 인해 로그인을 할 수 없습니다!')
                        router.refresh()
                        return
                    }
                    else{
                        return r.json()
                    }
                })
                .then(sessionId => {
                    console.log(sessionId)
                    if(!sessionId){
                        return
                    }
                    const item = {
                        value : sessionId,
                        expiry : now.getTime() + 3 * 60 * 60 * 1000
                    }
                    
                    // 3시간으로 유지
                    localStorage.setItem("sessionId",JSON.stringify(item))
                    router.push('/')
                })
            }}>LOGIN</button>
        </div>
    )
}