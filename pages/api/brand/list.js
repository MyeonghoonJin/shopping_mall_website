import { connectDB } from "@/util/database";

export default async function Brand(req,res){
    
    if(req.method != 'GET'){
        return res.status(405).json({ error: "잘못된 메소드 요청" });
    }
    // console.log(req.query.category)

    try {
        
        

        const db = (await connectDB).db("shopping_mall");
        const brandList = await db.collection("brand")
            .find({ category: { $in: [req.query.category] } }) // 선택된 카테고리 기반 검색
            .toArray();
        
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json('서버 에러')
    }
    
}