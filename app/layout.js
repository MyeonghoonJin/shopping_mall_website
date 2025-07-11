import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LoginBtn from "./loginBtn";
import { getServerSession } from "next-auth";
import LogoutBtn from "./logoutBtn";
import { connectDB } from "@/util/database";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shopping Mall",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {

  let session = await getServerSession(authOptions)
  if(session){

  }
  return (
    <html lang="en">
      <body>
        <div className="nav-bar">
          <Link href='/'><h2>musinsa</h2></Link>
          {
            session? session.user.role == 'admin' ? <Link href='/admin/product/register'>상품 등록</Link> : <></>
            : <></>
          }
          {/* ✅ 오른쪽 버튼 컨테이너 */}
          <div className="right-buttons">
            {
              session ? <img src={ session.user?.src ? session.user.src : '/default_profile.jpg'} className="profile"/> : ''
            }
            {
              session ? 
              <div>
                {
                  session.user.role == 'admin' ? <p>운영자 모드입니다.</p> : <p>{session.user.name}님 환영합니다!</p>
                }
                <LogoutBtn/>
              </div> 
              : <LoginBtn/> 
            } 
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
