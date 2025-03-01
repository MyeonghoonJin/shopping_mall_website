'use client'

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

export default function Register(){


    let [id,setId] = useState()
    let [pwd,setPwd] = useState()
    let [pwd_check,setPwd_check] = useState()
    let [email,setEmail] = useState()
    let [address,setAddress] = useState()
    let [address2,setAddress2] = useState()
    let [address3,setAddress3] = useState()
    let [name,setName] = useState()
    let [phone_number,setPhone_number] = useState()
    let [src,setSrc] = useState()
    let fileInputRef = useRef();
    let router = useRouter()
    

    return(
        <div>
        <h3>회원가입</h3>
        <div className="register-account">
            <label>아이디:</label>
            <input type="text" name="id" placeholder="아이디" onChange={(e) => {
                setId(e.target.value)
            }} />
            <label>비밀번호</label>                 
            <input type="password" name="pwd" placeholder="비밀번호" onChange={(e) => {
                setPwd(e.target.value)       
            }}/>
            <label>비밀번호 확인</label> 
            <input type="password" name="pwd_check" placeholder="비밀번호 확인" onChange={(e) => {
                setPwd_check(e.target.value)                
            }}/>
            <label>email</label>               
            <input type="text" name="email" placeholder="이메일 주소" onChange={(e) => {
                setEmail(e.target.value)               
            }}/>
        </div>
        <div className="register-user">
            <label>이름</label>               
            <input type="text" name='name' placeholder="이름" onChange={(e) => {
                setName(e.target.value)               
            }}/>             
            <label>address</label>               
            <input type="text" name='address1' placeholder="시" onChange={(e) => {
                setAddress(e.target.value)                
            }}/>  
            <input type="text" name='address2' placeholder="군" onChange={(e) => {
                setAddress2(e.target.value)                
            }}/>
            <input type="text" name='address3' placeholder="구" onChange={(e) => {
                setAddress3(e.target.value)                
            }}/>               
            <label>휴대폰 번호</label>               
            <input type="text" name="phone_number" placeholder="휴대폰 번호(-제외)" onChange={(e) => {
                setPhone_number(e.target.value)
            }}/>
            

            <input type="file" name="profile" accept="image/*" onChange={async(e) =>{
                let file = e.target.files[0]
                if (!file) {
                    console.error("파일이 선택되지 않았습니다.");
                    return;
                }

                let filename = encodeURIComponent(file.name)

                //presignedURL 구해오기
                let result = await fetch('api/util/presignedURL?file=' + filename)
                result = await result.json()

                //S3 업로드 
                const formData = new FormData()
                Object.entries({ ...result.fields, file }).forEach(([key, value]) => {
                    formData.append(key, value)
                })
                let 업로드결과 = await fetch(result.url, {
                    method: 'POST',
                    body: formData,
                })
                if(업로드결과.ok){
                    setSrc(업로드결과.url + '/' + filename)
                }else {
                    console.log('실패')
                }
            }}/>
            {
                src ? 
                    <div>
                        <img className='profile-preview' src={src} ref={fileInputRef}/>
                        <button onClick={() => {
                            if(fileInputRef.current){
                                setSrc('')
                                fileInputRef.current.value='' //파일 초기화
                                router.refresh()
                            }
                        }}>X</button>
                    </div> 
                        : ''
            }
        </div>
        <button onClick={() => {

            // 통합 주소값
            address = address + " " + address2 + " " + address3

            fetch('api/auth/register',{
                method : 'POST',
                body : JSON.stringify({
                    id : id,
                    pwd : pwd,
                    pwd_check : pwd_check,
                    email : email,
                    address : address,
                    name : name,
                    phone_number : phone_number,
                    src : src
                }),
            })
            .then(r => {
                //비밀번호 불일치
                if(r.status == '400'){
                    alert('비밀번호가 다릅니다!')
                    router.refresh()
                    return
                }
                if(r.status == '401'){
                    alert('이미 존재하는 아이디또는 이메일입니다!')
                    router.refresh()
                    return
                }
                if(r.status == '402'){
                    alert('모두 입력해주세요!')
                    router.refresh()
                    return
                }
                alert('회원가입 성공!')
                router.push('/')
                return r.json()
            })
        }}>회원가입</button>

        <div className="social-login-container">
            <h3>이미 가입하셨나요?</h3>

                {/* 새로운 페이지(기본 로그인 폼)가 열림 */}
                <button className="id-login-button" onClick={()=>signIn()}>아이디 로그인</button>

                {/*페이지 이동 없이 바로 소셜 로그인 */}
                {/* <button className={`kakao-login-button`} onClick={() => signIn("kakao", { redirect: true, callbackUrl: "/" })}>카카오 로그인</button> */}
                <button className={`naver-login-button`} onClick={() => signIn("naver", { redirect: true, callbackUrl: "/" })}>네이버 로그인</button>

        </div>
        </div>
    )
}