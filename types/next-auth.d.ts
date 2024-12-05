// types/auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    fullName: string;
    companyName: string;
  }

  interface Session {
    user: User & {
      fullName: string;
      companyName: string;
    };
    token: {
      fullName: string;
      companyName: string;
    };
  }
}
