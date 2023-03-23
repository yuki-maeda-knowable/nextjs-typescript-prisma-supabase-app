import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import prisma from "../../../lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  //signinのページは作成したフォームを使用する
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      // メールでログインする時とかに表示させる文言
      // デフォルトは「Sign in with Credentials」と表示される。
      // nameを指定すると「Credentials」の部分が書き変わる
      name: "Email",

      type: "credentials",
      // next-auth側が準備したフォームを使用するなら以下のように記載する。こちらが用意したフォームを使用するなら、空でいい。
      //その代わりどのページを使用するかをpages:{}で指定する
      // Credentialsを使用した「sign in」時に以下の項目を入力させるフォームが表示
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials, req) {
        // const { email, password } = credentials as {
        //   email: string;
        //   password: string;
        // };
        //ログインしようとしているユーザをDBから探し出す
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        //userがいない、credentialsも空、userのpasswordが違ったらnull
        if (!user || !credentials || !user.password) {
          return null;
        }

        //フォームに入力されたpasswordとDBに保存しているpasswordを比較し、NGだったらnull
        //passwordを比較した結果を格納
        const comparePassword = await bcrypt.compare(
          credentials?.password,
          user.password
        );
        // 比較した結果がtrueだったら
        if (comparePassword) {
          return {
            ...user,
            id: user.id.toString(),
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    //tokenをuseridにして、
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // sessionのuser.idにidを代入 *こうしないとDBに格納しているuserのIDが取得できなかった
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);
