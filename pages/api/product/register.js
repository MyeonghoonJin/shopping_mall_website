import product from "@/app/product/[id]/page";
import { connectDB } from "@/util/database";
import { IncomingForm } from "formidable";

export const config = {
    api: {
      bodyParser: false, // Next.js 기본 bodyParser 비활성화 (formidable 사용 시 필요)
    },
  };

export default async function ProductRegister(req,res) {
    if(req.method != 'POST'){
        return res.status(405).json({ error: "잘못된 메소드 요청" });
    }
    
    try {
        
        const form = new IncomingForm();
        form.parse(req, async (err, fields) => {
            if (err) {
              console.error("Error parsing form data:", err);
              return res.status(500).json({ error: "서버 에러" });
            }
            console.log("Fields:", fields); // 📌 `req.body`에 해당하는 텍스트 데이터
            
            const db = await (await connectDB).db('shopping_mall')
    
            let result = await db.collection('product').insertOne({
                product_name : fields.product_name[0],
                category: fields.category,
                price : fields.price[0],
                thumbnail : fields.thumbnail,
                description : fields.description[0],
            })
        })
        return res.status(200).redirect('/')
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json('서버 에러')
    }
}