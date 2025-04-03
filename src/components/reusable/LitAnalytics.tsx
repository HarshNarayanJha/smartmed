"use client"

import { Lit } from "litlyx-js"
import { useEffect } from "react"

const LIT_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_LIT_PROJECT_ID,
  nodeEnv: process.env.NODE_ENV
}

export default function LitAnalytics() {
  useEffect(() => {
    if (LIT_CONFIG.nodeEnv === "production") {
      console.log("Intializing Lit")
      Lit.init(LIT_CONFIG.projectId)
    }
  }, [])

  return null
}
