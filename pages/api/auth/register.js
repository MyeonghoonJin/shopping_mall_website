import { connectDB } from "@/util/database"
import bcrypt from 'bcrypt'
import formidable from "formidable";


export default async function Register(req,res) {
    
    if(req.method != 'POST'){
        return res.status(405).json({ error: "잘못된 메소드 요청" });
    }
    req.body = JSON.parse(req.body)
    
    const client = await connectDB
    const db = await client.db('shopping_mall')


    try{
        // console.log(!req.body.phone_number)

        // 공백 방지
        if(!req.body.id || !req.body.pwd || !req.body.pwd_check || !req.body.email || !req.body.name || !req.body.phone_number){
            return res.status(402).json('모두 입력해주세요!')
        }
        //비밀번호 확인
        if(req.body.pwd != req.body.pwd_check){
            return res.status(400).json('비밀번호 불일치')
        }
        //중복된 이메일또는 아이디 체크
        let dupId = await db.collection('user').findOne({id : req.body.id})
        let dupEmail = await db.collection('user').findOne({email : req.body.email})
        if(dupEmail || dupId){
            return res.status(401).json('중복 아이디 또는 이메일')
        }
        //비밀번호 확인 삭제
        delete req.body.pwd_check

        //비밀번호 암호화
        let hash = await bcrypt.hash(req.body.pwd,10)
        req.body.pwd = hash

        //admin 설정
        if(req.body.email == 'audgns1947@dgu.ac.kr'){
            req.body.role = 'admin'
        }
        else{
            req.body.role = 'normal'
        }

        let result = await db.collection('user').insertOne(req.body)

        return res.status(200).json('가입 성공')
    }
    catch(error){
        console.log(error)
        res.status(500).json('서버 오류')
    }
}