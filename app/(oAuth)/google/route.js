import {NextResponse} from "next/server";
import {generateState, generateCodeVerifier} from "arctic"
import {google} from "@/lib/oauth/google"

export async function GET(req) {
    try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);
    const cookieConfig = {
        httpOnly : true, 
        secure : true, 
        maxAge : 60 * 60 * 24 * 7,
        sameSite : "lax" // this is because when google redirects to our websites cookies are maintained 
    }
    const res = NextResponse.redirect(url);
    res.cookies.set("oAuth_state", state, cookieConfig);
    res.cookies.set("oAuth_codeVerifier", codeVerifier, cookieConfig);
    return res;
    } catch(error) {
        console.log(error);
        return NextResponse.redirect("http://localhost:3000/login");
    }
}
