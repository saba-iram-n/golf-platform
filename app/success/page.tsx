"use client"

export const dynamic = "force-dynamic"
export const revalidate = 0

import { useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function Success() {

  useEffect(() => {
    const updateSubscription = async () => {

      const params = new URLSearchParams(window.location.search)
      const userId = params.get("userId")

      if (!userId) {
        window.location.href = "/login"
        return
      }

      const { error } = await supabase
        .from("users")
        .update({ is_subscribed: true })
        .eq("id", userId)

      if (error) {
        console.log(error)
        return
      }

      window.location.href = "/dashboard"
    }

    updateSubscription()
  }, [])

  return <p className="text-center mt-10">Processing payment...</p>
}