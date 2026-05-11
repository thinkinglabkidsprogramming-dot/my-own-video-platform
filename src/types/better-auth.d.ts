import type { DefaultSession } from "better-auth";

declare module "better-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      role: string;
    };
  }
}
