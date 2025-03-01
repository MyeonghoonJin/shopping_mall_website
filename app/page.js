import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"

export default async function(){

  let session = await getServerSession(authOptions)
  //id : 해당 ObjectId 밖에 안뜸. 왜지??? 
  // console.log(session)

  return (
    <div>
      <h2>메인 페이지</h2>
      {}
    </div>
  )
}