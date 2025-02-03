import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}`;
  console.log(`🚀 [${requestId}] Email confirmation route hit`);

  try {
    const url = new URL(request.url);
    const token_hash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type") as EmailOtpType | null;
    const next = url.searchParams.get("next") ?? "/";

    if (!token_hash || !type) {
      console.error(`❌ [${requestId}] Missing token_hash or type`);
      return NextResponse.redirect(`${url.origin}/auth-error`);
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error(`❌ [${requestId}] OTP verification error:`, error);
      return NextResponse.redirect(`${url.origin}/auth-error`);
    }

    console.log(`✅ [${requestId}] Email verification successful`);
    return NextResponse.redirect(`${url.origin}${next}`);
  } catch (error) {
    console.error(`❌ [${requestId}] Email confirmation error:`, error);
    return NextResponse.redirect(`${new URL(request.url).origin}/auth-error`);
  }
}
