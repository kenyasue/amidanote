import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";
let prisma;
// ローカルでは大量にデータベースコネクションを張ってしまうことがあるので、
// このようなアプローチをとる。TypeScript が global type に prisma がないと怒るので、
// ルートディレクトリに global.d.ts を作成し、
// export {};
// declare global {
//   namespace NodeJS {
//     interface Global {
//       prisma: any;
//     }
//   }
// }
// としてあげれば治る
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/", // Error code passed in query string as ?error=
  },
  adapter: Adapters.Prisma.Adapter({ prisma }),
};
export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
