import NextAuth from "next-auth";

import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null;
    } & DefaultSession["user"];
  }
  // interface JWT {
  //   /** The user's role. */
  //   userRole?: string;
  // }
}
