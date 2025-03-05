import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb"
import CategoryBtn from "./categoryBtn"
import ProductMainInfo from "./productMainInfo"
import styles from "./product.module.css";
import ProductDetailInfo from "./productDetailInfo";

export default async function product(props){

    //product_id
    let product_id =  props.params.id

    const db = await (await connectDB).db('shopping_mall')
    
    let product = await db.collection('product').findOne({_id : new ObjectId(product_id)}) 

    
    product._id = product._id.toString()
    // console.log(product)
    return(
        <div>
            <br></br>
            <h2 className="product-header">상세 페이지</h2>
            <CategoryBtn product = {product} styles = {styles}/>
            <ProductMainInfo product = {product} styles = {styles} />
            <ProductDetailInfo product = {product} styles = {styles} />
        </div>
    )
}