'use client'
import { useRouter } from "next/navigation"
import {signIn} from 'next-auth/react'

export default function LoginBtn() {

    let router = useRouter()

    return(
        <div>
            <button onClick={async() => {
                // router.push("/login"); // 로그인 후 이동할 페이지
                signIn()
            }}>LOGIN</button>
            <button onClick={() => {
                router.push('/register')
            }}>REGISTER</button>
        </div>
    )
}