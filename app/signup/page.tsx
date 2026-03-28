"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Check your email to confirm!")
    }
  }

  return (
    <div className="flex flex-col bg-gray-700 items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Signup</h1>
      
      <input 
        className="border p-2"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input 
        className="border p-2"
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button 
        className="bg-gray-400 text-white px-4 py-2"
        onClick={handleSignup}
      >
        Signup
      </button>
    </div>
  )
}