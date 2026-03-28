"use client"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    window.location.href = "/login"
  }, [])

  return <p className="text-center mt-10">Redirecting...</p>
}