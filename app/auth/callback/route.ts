import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}`;
  console.log(`🚀 [${requestId}] Auth callback route hit`);

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") ?? "/dashboard";

    if (!code) {
      console.error(`❌ [${requestId}] No code provided`);
      return NextResponse.redirect(`${url.origin}/auth-error`);
    }

    const supabase = await createClient();

    // Exchange code for session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      console.error(`❌ [${requestId}] Auth error:`, authError);
      return NextResponse.redirect(`${url.origin}/auth-error`);
    }

    console.log(`✅ [${requestId}] Session established for:`, {
      userId: session?.user?.id,
      email: session?.user?.email,
    });

    // Store Google tokens if present
    if (session?.provider_token && session?.provider_refresh_token) {
      try {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            google_access_token: session.provider_token,
            google_refresh_token: session.provider_refresh_token,
            google_token_expires_at: new Date(
              Date.now() + (session.expires_in ?? 3600) * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", session.user.id);

        if (updateError) {
          console.error(`⚠️ [${requestId}] Token storage error:`, updateError);
          // Continue anyway as auth succeeded
        } else {
          console.log(
            `✅ [${requestId}] Google tokens stored for user:`,
            session.user.id
          );
        }
      } catch (error) {
        console.error(`⚠️ [${requestId}] Token storage error:`, error);
        // Continue as auth succeeded
      }
    }

    return NextResponse.redirect(`${url.origin}${next}`);
  } catch (error) {
    console.error(`❌ [${requestId}] Callback error:`, error);
    return NextResponse.redirect(`${new URL(request.url).origin}/auth-error`);
  }
}
