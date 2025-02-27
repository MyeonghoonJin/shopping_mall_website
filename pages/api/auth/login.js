import { connectDB } from "@/util/database";
import redis from "@/util/redis";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { cookies } from "next/headers";
import { serialize } from "v8";

export default async function LoginHandler(req,res) {
    
    if(req.method != 'POST'){
        return res.status(405).json({ error: "잘못된 메소드 요청" });
    }

    try{
        
        const client = await connectDB
        const db = await client.db('shopping_mall')
        req.body = JSON.parse(req.body)

        //아이디 존재 확인
        let user = await db.collection('user').findOne({id : req.body.id})
        if(!user){
            return res.status(400).json('해당 아이디 유저 없음')
        }
        //비밀번호 확인 
        const pwcheck = await bcrypt.compare(req.body.pwd,user.pwd)
        if(!pwcheck){
            return res.status(400).json('비밀번호 오류')
        }

        //랜덤 sessionId 설정
        const sessionId = crypto.randomUUID()

        //연결 오류 처리
        redis.on("error", (err) => {
            console.error("❌ Redis 연결 오류:", err);
          });

        // Redis에 유저 정보 저장 (세션 ID로 유저 정보 조회 가능)
        await redis.set(sessionId,JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            address : user.address,
            phone_number : user.phone_number,
            profile : user.profile || ''
        }),"EX", 3 * 60 * 60)
        // console.log(sessionId)

        //쿠키에 세션ID 저장
        res.setHeader(
            "Set-Cookie",
            `sessionId=${sessionId}; Path=/; Max-Age=10800; httpOnly=true;`     
        )
        
        return res.status(200).redirect('/')
    }
    catch(error){
        console.log(error)
        return res.status(500).json('서버 오류')
    }
}