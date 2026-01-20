import {NextResponse} from "next/server";
import {generateState} from "arctic";
import {github} from "@/lib/oauth/github";

export async function GET(req) {
    try {
        const state = generateState();
        const url = github.createAuthorizationURL(state, ["user:email"]);
        const cookieConfig = {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax" // this is because when github redirects to our websites cookies are maintained 
        };
        const res = NextResponse.redirect(url);
        res.cookies.set("oAuth_state", state, cookieConfig);
        return res;
    } catch (error) {
        console.log(error);
        return NextResponse.redirect("http://localhost:3000/login");
    }
}
