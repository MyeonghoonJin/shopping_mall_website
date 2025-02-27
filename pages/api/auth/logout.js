import redis from "@/util/redis";
import { cookies } from "next/headers"
export default async function Logout(req,res){

    if(req.method != 'DELETE'){
        return res.status(405).json({ error: "잘못된 메소드 요청" });
    }

    //sessionId
    req.query.sessionId

    if(!req.query.sessionId){
        return res.status(400).json({ error: "Session ID가 필요합니다." });
    }

    try{
        //Redis에서 세션ID 제거
        let result = await redis.del(req.query.sessionId)
        console.log(result)
        if(result == 0){
            return res.status(400).json('삭제 실패')
        }
        else if(result == 1){
            //쿠키에서 세션ID 제거
            res.setHeader(
                "Set-Cookie",
                `sessionId=; Path=/; Max-Age=0; httpOnly=true;`     
            )
            return res.status(200).redirect('/')
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).json('서버 오류')
    }
    
}