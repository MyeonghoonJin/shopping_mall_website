import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { connectDB } from "@/util/database"
import { getServerSession } from "next-auth"
import Items from "./items"
import styles from "./page.module.css";

export default async function(){

  const db = await (await connectDB).db('shopping_mall')
  let items = await db.collection('product').find().toArray()

  let session = await getServerSession(authOptions)
  // console.log(session)

  // _id를 문자열로 변환 (직렬화)
  items = items.map(item => ({
    ...item,
    _id: item._id.toString(), // ObjectId -> String 변환
  }));

  return (
    <div>
      <h2>메인 페이지</h2>
      <br></br>
    <Items items = {items} styles = {styles}/>
    </div>
  )
}