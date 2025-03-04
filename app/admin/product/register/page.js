import { connectDB } from "@/util/database";
import Input from "./input";
import styles from '../product.module.css'

export default async function RegisterProduct(){


    // MongoDB에서 해당 category에 맞는 브랜드 목록 가져오기
    const db = (await connectDB).db("shopping_mall");
    const brands = await db.collection("brand")
        .find()
        .toArray();
    for(let brand of brands){
        brand._id = brand._id.toString()
    }
    return(
        <div>
            <Input totalbrands = {brands} styles = {styles}></Input>
        </div>
    )
}
