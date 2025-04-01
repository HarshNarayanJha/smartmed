import { type EmailOtpType } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

import { createClient } from "@/utils/supabase/server"

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = "/welcome"

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete("token_hash")
  redirectTo.searchParams.delete("type")

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash
    })

    if (!error) {
      console.log("verification successful, redirecting to", redirectTo)
      redirectTo.searchParams.delete("next")
      return NextResponse.redirect(redirectTo)
    }

    console.log("verification failed", error)
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error"
  console.log("verification failed, redirecting to", redirectTo)
  return NextResponse.redirect(redirectTo)
}
