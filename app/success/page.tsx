"use client"

import { useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function Success() {

  useEffect(() => {
    const updateSubscription = async () => {

      // ✅ safer way (works in production)
      const params = new URLSearchParams(window.location.search)
      const userId = params.get("userId")

      if (!userId) {
        alert("No user ID found")
        window.location.href = "/login"
        return
      }

      const { error } = await supabase
        .from("users")
        .update({ is_subscribed: true })
        .eq("id", userId)

      if (error) {
        console.log(error)
        alert("Update failed")
        return
      }

      alert("Subscription activated ✅")
      window.location.href = "/dashboard"
    }

    updateSubscription()
  }, [])

  return <p className="text-center mt-10">Processing payment...</p>
}