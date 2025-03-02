import { connectDB } from "@/util/database";

export default async function List(req,res) {
    
    if(req.method != 'GET'){
        return res.status(405).json({ error: "잘못된 메소드 요청" });
    }
    if(req.query.page == 'main'){
        try{
            const db = await (await connectDB).db('shopping_mall')
            
            let items = await db.collection('product').find().toArray()
    
            // _id를 문자열로 변환 (직렬화)
            items = items.map(item => ({
                ...item,
                _id: item._id.toString(), // ObjectId -> String 변환
            }));
            // console.log(items)

            return res.status(200).json(items)
        }
    
        catch(error){
            console.log(error)
            return res.status(500).json('서버 에러')
        }

    }
        


}