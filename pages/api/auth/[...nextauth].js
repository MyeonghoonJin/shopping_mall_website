import { connectDB } from "@/util/database";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    GithubProvider({
      // nextjslogin info
      clientId: 'Ov23lidq3EHwsdyKAJ4K',
      clientSecret: '7084930b756e751aa644c8e47d0e95ad33951e5f',
      // nextjslogindeploy info
      // clientId: '',
      // clientSecret: '',
    }),
    // GoogleProvider({
    //   clientId: '',
    //   clientSecret: '',
    // }),
    CredentialsProvider({
      //1. 로그인페이지 폼 자동생성해주는 코드 
      name: "credentials",
        credentials: {
          id: { label: "ID", type: "text", placeholder:'아이디'},
          pwd: { label: "password", type: "password", placeholder: '비밀번호' },
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
        const pwcheck = await bcrypt.compare(credentials.pwd, user.pwd);
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
      strategy: 'jwt',
      maxAge:  30 * 60 //30분
    },

  callbacks: {
    //4. jwt 만들 때 실행되는 코드 
    //user변수는 DB의 유저정보담겨있고 token.user에 뭐 저장하면 jwt에 들어갑니다.
    // 웬만하면 불변 요소를 넣어야 한다.
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {};
        token.user.id = user.id;
        token.user.email = user.email;
        token.user.name = user.name;
        token.user.role = user.role;
        token.user.address = user.address;
        token.user.phone_number = user.phone_number;
        token.user.src = user.src;
      }
      return token;
    },
    //5. 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }) => {
      session.user = token.user;  
      return session;
    },
  },

  secret : process.env.NEXTAUTH_SECRET, //jwt생성시쓰는암호
  adapter : MongoDBAdapter(connectDB)
  
};
export default NextAuth(authOptions); 