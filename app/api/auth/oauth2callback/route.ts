import { createSession, generateSessionToken } from "@/lib/auth"
import { setSessionTokenCookie } from "@/lib/cookie"
import { prisma } from "@/lib/db"
import { google } from "@/lib/google-client"
import { decodeIdToken, OAuth2Tokens } from "arctic"
import { cookies } from "next/headers"

type GoogleIdTokenClaims = {
    sub: string
    name: string
    email?: string
    picture?: string
  }

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    const cookieStore = await cookies()
    const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
	const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

    let tokens: OAuth2Tokens

    try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		return new Response(null, {
			status: 400
		});
	}

    const claims = decodeIdToken(tokens.idToken()) as GoogleIdTokenClaims;
	const googleUserId = claims.sub ;
	const username = claims.name;

    const existingUser = await prisma.user.findUnique({
        where: {
            googleid: googleUserId
        }
    })

    if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		await setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

    const user = await prisma.user.create({
        data: {
            googleid: googleUserId,
            name: username 
        }
    })
    

    const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	await setSessionTokenCookie(sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});

}