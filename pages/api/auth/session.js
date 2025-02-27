import { cookies } from "next/headers";

export default function Session(req,res){

    if(req.method != 'GET'){
        return res.status(405).json({ error: "잘못된 메소드 요청" });
    }
    
    //sessionId
    let sessionId = req.cookies.sessionId
    try{
        return res.status(200).json(sessionId)
    }
    catch(error){
        console.log(error)
        return res.status(500).json('서버 오류')
    }

}