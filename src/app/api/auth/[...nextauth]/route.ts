import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            "https://diary-backend-production-e2fc.up.railway.app/api/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password,
              }),
            }
          );
          const data = await res.json();
          if (res.ok && data.token) {
            return {
              id: data.user.id,
              name: data.user.username,
              accessToken: data.token,
            };
          }
          return null;
        } catch (e) {
          // PERBAIKAN: Gunakan variabel 'e' agar tidak error "defined but never used"
          console.error("Authorize error:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // PERBAIKAN: Hapus 'profile' karena tidak dipakai
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(
            "https://diary-backend-production-e2fc.up.railway.app/api/auth/google",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                username: user.name,
                avatar: user.image,
              }),
            }
          );

          const data = await res.json();

          if (res.ok && data.token) {
            user.accessToken = data.token;
            user.id = data.user.id;
            return true;
          }
          return false;
        } catch (error) {
          console.error("Gagal connect backend:", error);
          return false;
        }
      }
      return true;
    },

    // PERBAIKAN: Hapus 'account' karena tidak dipakai di sini
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
