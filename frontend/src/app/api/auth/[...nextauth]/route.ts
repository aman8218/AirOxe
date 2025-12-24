import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data.success) {
            return {
              id: response.data.data.user.id,
              email: response.data.data.user.email,
              name: response.data.data.user.fullName,
              role: response.data.data.user.role,
              token: response.data.data.token,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth sign in
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const response = await axios.post(`${API_URL}/auth/oauth`, {
            provider: account.provider,
            email: user.email,
            name: user.name,
            image: user.image,
          });

          if (response.data.success) {
            // Store token in user object
            user.token = response.data.data.token;
            user.role = response.data.data.user.role;
            return true;
          }
        } catch (error) {
          console.error('OAuth sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };