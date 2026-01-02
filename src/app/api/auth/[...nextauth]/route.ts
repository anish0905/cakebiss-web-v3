import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          // Yahan ID pass karna zaroori hai
          return { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email, 
            role: user.role 
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id; // User ID ko token mein dala
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string; // Token se ID session mein dali
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };