import { type EmailOtpType } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

import { createClient } from "@/utils/supabase/server"

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  const welcomePath = "/welcome"
  const errorPath = "/error"

  const redirectBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin

  const createRedirectResponse = (pathname: string): NextResponse => {
    const redirectUrl = new URL(pathname, redirectBaseUrl)
    console.log(`Redirecting to: ${redirectUrl.toString()}`)
    return NextResponse.redirect(redirectUrl)
  }

  // Check if token_hash and type are present in the query parameters
  if (token_hash && type) {
    const supabase = await createClient()

    // Attempt to verify the OTP (email confirmation token) with Supabase
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash
    })

    if (!error) {
      console.log("Email verification successful.")
      return createRedirectResponse(welcomePath)
    }

    console.error("Email verification failed:", error.message)
  } else {
    console.error(
      "Verification failed: Missing 'token_hash' or 'type' in query parameters."
    )
  }

  console.log("Redirecting user to error page.")
  return createRedirectResponse(errorPath)
}
