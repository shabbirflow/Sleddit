import { NextAuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from 'nanoid';

// Configuration options for NextAuth
const authOptions: NextAuthOptions = {
  // Use Prisma as the data adapter for NextAuth
  adapter: PrismaAdapter(db),

  // Configure the session strategy as JSON Web Token (JWT)
  session: {
    strategy: "jwt",
  },

  // Define custom pages for authentication
  pages: {
    signIn: '/sign-in'
  },

  // Configure authentication providers, in this case, Google OAuth
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Custom callbacks for handling session and JWT
  callbacks: {
    // Callback to populate the user session
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },

    // Callback to manipulate the JWT token
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      if(!dbUser.username){
        // Generate a random username if it doesn't exist
        await db.user.update({
            where: {
                id: dbUser.id
            },
            data: {
                username: nanoid(10)
            }
        })
      }

      // Return user information in the JWT token
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        username: dbUser.username,
        picture: dbUser.image
      }
    },

    // Callback to redirect after successful authentication
    redirect(){
      return '/';
    }
  },
};

// Initialize NextAuth with the provided configuration
const handler = NextAuth(authOptions);

// Export the handler as GET and POST for API routes
export { handler as GET, handler as POST };

// Export a function to retrieve the authentication session
export const getAuthSession = () => getServerSession(authOptions);
