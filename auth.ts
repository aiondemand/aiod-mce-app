import NextAuth from "next-auth"
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
                //console.log('account', account)
                logger.debug('user: ' + JSON.stringify(user, null, 2))
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = (account.expires_in || 0) + Date.now() / 1000

            } else if (token.expiresAt !== undefined && Date.now() > token.expiresAt * 1000 && token.refreshToken !== undefined) {
                logger.info('refreshing token')
                try {
                    const resp = await renewToken(process.env.AUTH_KEYCLOAK_ID || '', process.env.AUTH_KEYCLOAK_SECRET || '', token.refreshToken)
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
            }
            return token
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

declare module "@auth/core/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        provider?: string
        accessToken?: string
        refreshToken?: string
        expiresAt?: number
        error?: "RefreshAccessTokenError" | "LoginFailed"
    }
}
