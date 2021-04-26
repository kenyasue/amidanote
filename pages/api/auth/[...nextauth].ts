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
    {
      id: "standalone",
      name: "StandaloneMode",
      type: "oauth",
      version: "2.0",
      params: { grant_type: "authorization_code" },

      /*
      accessTokenUrl: `http://localhost:3030/oauth/token`,
      requestTokenUrl: `http://localhost:3030/oauth/token`,
      authorizationUrl: `http://localhost:3030/oauth?response_type=code`,
      profileUrl: `http://localhost:3030/secure`,
      */

      accessTokenUrl: `${process.env.NEXTAUTH_URL}/api/auth/provider/token`,
      requestTokenUrl: `${process.env.NEXTAUTH_URL}/api/auth/provider/token`,
      authorizationUrl: `${process.env.NEXTAUTH_URL}/api/auth/provider/authenticate?response_type=code`,
      profileUrl: `${process.env.NEXTAUTH_URL}/api/auth/provider/profile`,

      async profile(profile: any, tokens: any) {
        console.log("provider profile", profile);
        console.log("provider tokens", tokens);
        // You can use the tokens, in case you want to fetch more profile information
        // For example several OAuth provider does not return e-mail by default.
        // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      clientId: "myClientId",
      clientSecret: "myClientSecret",
    },
  ],
  pages: {
    signIn: "/home",
    signOut: "/",
    error: "/", // Error code passed in query string as ?error=
  },
  adapter: Adapters.Prisma.Adapter({ prisma }),
};
export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
