"use client"

export const dynamic = "force-dynamic"

import { useEffect } from "react"

export default function Success() {

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const userId = params.get("userId")

      if (!userId) {
        window.location.href = "/login"
        return
      }

      await fetch("/api/update-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      })

      window.location.href = "/dashboard"
    }

    run()
  }, [])

  return <p className="text-center mt-10">Processing payment...</p>
}