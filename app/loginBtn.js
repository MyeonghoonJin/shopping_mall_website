'use client'
import {signIn} from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginBtn() {

    let router = useRouter()

    return(
        <div>
            <button onClick={async() => {
                router.push("/login"); // 로그인 후 이동할 페이지
            }}>LOGIN</button>
            <button onClick={() => {
                router.push('/register')
            }}>REGISTER</button>
        </div>
    )
}