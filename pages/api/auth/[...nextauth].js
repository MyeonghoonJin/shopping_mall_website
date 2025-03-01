import { connectDB } from "@/util/database";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    NaverProvider({
      // nextjslogin info
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      // nextjslogindeploy info
      // clientId: process.env.NAVER_CLIENT_ID_DEPLOY,
      // clientSecret: process.env.NAVER_CLIENT_SECRET_DEPLOY,
    }),
    KakaoProvider({
      // nextjslogin info
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      // nextjslogindeploy info
      // clientId: process.env.KAKAO_CLIENT_ID_DEPLOY,
      // clientSecret: process.env.KAKAO_CLIENT_SECRET_DEPLOY,
    }),
    CredentialsProvider({
    //1. 로그인페이지 폼 자동생성해주는 코드 
    name: "credentials",
      credentials: {
        id: { label: "아이디", type: "text", placeholder:'아이디'},
        pwd: { label: "비밀번호", type: "password", placeholder: '비밀번호' },
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
      maxAge: 30 * 60 //30분
    },

  callbacks: {
    //4. jwt 만들 때 실행되는 코드 
    // user변수는 DB의 유저정보담겨있고 token.user에 뭐 저장하면 jwt에 들어갑니다.
    // 웬만하면 불변 요소를 넣어야 한다.
    // Oauth방식에서 
    jwt: async ({ token, user,account, profile }) => {

      // console.log('account : ',account)
      // console.log('profile : ',profile)

      if (user) {
        //네이버 로그인
        if(account.provider == 'naver'){
          
          token.user = {};
          token.user.email = profile.response.email;
          token.user.name = profile.response.name;
          token.user.role = profile.response.email == 'audgns1947@dgu.ac.kr' ? 'admin' : 'normal';
          token.user.address = 'unknown';
          token.user.gender = profile.response.gender;
          token.user.phone_number = profile.response.mobile.replace(/-/g, ''); //하이픈 제거
          token.user.src = profile.response.profile_image;

          return token;   //리턴 잊지마
        }
        
        //카카오 로그인
        if(account.provider == 'kakao'){
          token.user = {};
          token.user.email = profile.kakao_account?.email ? profile.kakao_account.email : 'unknown';
          token.user.name =  profile.kakao_account?.profile?.nickname ? profile.kakao_account.profile.nickname : 'unknown';
          token.user.role = profile.kakao_account?.email == 'audgns1947@dgu.ac.kr' ? 'admin' : 'normal';
          token.user.address = 'unknown';
          token.user.gender = 'unknown';
          token.user.phone_number = profile?.response?.mobile.replace(/-/g, '') ? profile.response.mobile.replace(/-/g, '') : 'unknown'; //하이픈 제거
          token.user.src = profile.kakao_account.profile.profile_image_url;

          return token;   //리턴 잊지마
        }
        //credential 로그인
        
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