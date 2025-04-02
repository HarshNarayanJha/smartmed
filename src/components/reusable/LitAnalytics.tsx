"use client"

import { Lit } from "litlyx-js"
import { useEffect } from "react"

const LIT_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_LIT_PROJECT_ID
}

export default function LitAnalytics() {
  useEffect(() => {
    Lit.init(LIT_CONFIG.projectId)
  }, [])

  return null
}
