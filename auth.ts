import NextAuth from "next-auth"
import 'next-auth/jwt';
import Keycloak from "next-auth/providers/keycloak"
import { renewToken } from "./lib/server/auth"
import logger from "./lib/logger"

export const { handlers, signIn, signOut, auth } = NextAuth({
    basePath: (process.env.BASEPATH || '') + "/api/auth",
    pages: {
        //signIn: "/login",
    },
    providers: [
        Keycloak({
            clientId: process.env.AUTH_KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.AUTH_KEYCLOAK_CLIENT_SECRET,
            issuer: process.env.AUTH_KEYCLOAK_ISSUER,
            authorization: {
                params: {
                    scope: "openid profile email offline_access"
                }
            },
            profile(profile) {
                //console.log(profile)
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                logger.debug('user: ' + JSON.stringify(user, null, 2))
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = (account.expires_in || 0) + Date.now() / 1000
                return token
            }

            const nowSeconds = Date.now() / 1000
            const expiresAt = token.expiresAt ?? 0
            const hasRefreshToken = typeof token.refreshToken === 'string' && token.refreshToken.length > 0
            const isExpiredOrNear = nowSeconds > (expiresAt - 60)

            if (!hasRefreshToken || !isExpiredOrNear) {
                return token
            }

            logger.info('refreshing token')
            try {
                const resp = await renewToken(process.env.AUTH_KEYCLOAK_CLIENT_ID || '', process.env.AUTH_KEYCLOAK_CLIENT_SECRET || '', token.refreshToken as string)
                token.accessToken = resp.access_token
                token.refreshToken = resp.refresh_token
                token.expiresAt = (resp.expires_in || 0) + Date.now() / 1000
                return token
            } catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                logger.error('error refreshing token: ' + errMsg)
                return {
                    ...token,
                    error: 'RefreshAccessTokenError' as const,
                }
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.expiresAt = token.expiresAt;
            return session
        }
    },
})


declare module "next-auth" {
    interface Session {
        accessToken?: string;
        expiresAt?: number;
    }

}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        provider?: string
        accessToken?: string
        refreshToken?: string
        expiresAt?: number
        error?: "RefreshAccessTokenError" | "LoginFailed"
    }
}
