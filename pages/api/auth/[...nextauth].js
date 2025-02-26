import { connectDB } from "@/util/database";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Redis from "ioredis";
import redis from "@/util/redis";
import { profile } from "console";


export const authOptions = {
  providers: [
    // GithubProvider({
    //   // nextjslogin info
    //   clientId: 'Ov23lidq3EHwsdyKAJ4K',
    //   clientSecret: '7084930b756e751aa644c8e47d0e95ad33951e5f',
    //   // nextjslogindeploy info
    //   // clientId: '',
    //   // clientSecret: '',
    // }),
    // GoogleProvider({
    //   clientId: '',
    //   clientSecret: '',
    // }),
    CredentialsProvider({
      //1. 로그인페이지 폼 자동생성해주는 코드 
      name: "credentials",
        credentials: {
          id: { label: "id", type: "text" },
          password: { label: "password", type: "password" },
      },

      //2. 로그인요청시 실행되는코드
      //직접 DB에서 아이디,비번 비교하고 
      //아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
      async authorize(credentials) {
        let db = (await connectDB).db('shopping_mall');
        let user = await db.collection('user').findOne({id : credentials.id})
        if (!user) {
          console.log('해당 아이디는 없음');
          return null
        }
        const pwcheck = await bcrypt.compare(credentials.password, user.password);
        if (!pwcheck) {
          console.log('비번틀림');
          return null
        }
        return user
      }
    })
  ],
    //3. jwt 써놔야 잘됩니다 + jwt 만료일설정
    session: {
      strategy: 'database',
      maxAge:  3 * 60 * 60 //3시간
    },

  callbacks: {
    session : async ({ session, user }) => {
      if (user) {

        const sessionId = 'next-auth:session:' + crypto.randomUUID()

        // ✅ Redis에 유저 정보 저장 (세션 ID로 유저 정보 조회 가능)
        await redis.set(sessionId, JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          address : user.address,
          phone_number : user.phone_number,
          profile : user.profile || ''
        }), "EX", 3 * 60 * 60)
        
        session.sessionId = sessionId
      }
      return session;
    },
  },

  secret : process.env.NEXTAUTH_SECRET, //jwt생성시쓰는암호
};
export default NextAuth(authOptions); 