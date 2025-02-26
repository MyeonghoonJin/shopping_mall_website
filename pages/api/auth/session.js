import { connectDB } from "@/util/database";
import redis from "@/util/redis";

export default async function Session(req,res){

    if(req.method != 'GET'){
        return res.status(405).json({ error: "잘못된 메소드 요청" });
    }
    //sessionId
    req.query.sessionId

    try{

        let user = await redis.get(req.query.sessionId)
        user = JSON.parse(user)
        // console.log(user)
        
        return res.status(200).json(user)
    }
    catch(error){
        console.log(error)
        return res.status(500).json('서버 오류')
    }

}