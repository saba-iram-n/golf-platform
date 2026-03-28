"use client"
import { useEffect } from "react"
import { supabase } from "../../lib/supabase"
import { useSearchParams } from "next/navigation"

export default function Success() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const updateSubscription = async () => {
      const userId = searchParams.get("userId") // ✅ GET USER ID

      if (!userId) {
        alert("No user ID found")
        window.location.href = "/login"
        return
      }

      const { data, error } = await supabase
        .from("users")
        .update({ is_subscribed: true })
        .eq("id", userId)
        .select()
      console.log(data, error)

      if (error) {
        console.log(error)
        alert("Update failed")
        return
      }

      alert("Subscription activated ✅")
      window.location.href = "/dashboard"
    }

    updateSubscription()
  }, [searchParams])

  return <p className="text-center mt-10">Processing payment...</p>
}