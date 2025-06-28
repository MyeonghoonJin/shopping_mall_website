import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { connectDB } from "@/util/database"
import { getServerSession } from "next-auth"
import Items from "./items"
import styles from "./page.module.css";

export default async function({searchParams}){

  const db = await (await connectDB).db('shopping_mall')
  //pagenation
  let totalItems = await db.collection('product').countDocuments();
  let currentPage = parseInt(searchParams?.page) || 1;
  let itemsPerPage = 10;
  let totalPages = Math.ceil(totalItems / itemsPerPage);
  let skipCount = (currentPage - 1) * itemsPerPage;
  let items = await db.collection('product')
    .find()
    .skip(skipCount)
    .limit(itemsPerPage)
    .toArray();
  // let session = await getServerSession(authOptions)
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
    <Items items = {items} totalPages={totalPages} styles = {styles}/>
    </div>
  )
}