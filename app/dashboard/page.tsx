"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [score, setScore] = useState("")
  const [scores, setScores] = useState<any[]>([])
  const [winnings, setWinnings] = useState<any[]>([])

  // 🔐 Get user
  useEffect(() => {
    const getUser = async () => {
      // const { data } = await supabase.auth.getUser()

      // if (!data.user) {
      //   window.location.href = "/login"
      // } else {
      //   setUser(data.user)
      //   fetchScores(data.user.id)
      //   fetchWinnings(data.user.id)
      // }

      const { data } = await supabase.auth.getUser()

      if (!data.user) {
      window.location.href = "/login"
      return
      }

    const userId = data.user.id

    setScores([])
    setWinnings([])
    // now safe to use
    const { data: subData } = await supabase
    .from("users")
    .select("is_subscribed")
    .eq("id", userId)
    .single()

    const finalUser = {
      ...data.user,
      is_subscribed: subData?.is_subscribed || false
    }

    setUser(finalUser)

    fetchScores(userId)
    fetchWinnings(userId)
    }

    getUser()

    window.addEventListener("focus", getUser)
    return () => window.removeEventListener("focus", getUser)

  }, [])

    
  // 📊 Fetch scores
  const fetchScores = async (userId: any) => {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (!error) setScores(data || [])
  }

  // 🏆 Fetch winnings
  const fetchWinnings = async (userId: any) => {
    const { data } = await supabase
      .from("winners")
      .select("*")
      .eq("user_id", userId)

    setWinnings(data || [])
  }

  // ➕ Add score
  const addScore = async () => {
    if (!user) return

    if (!score || isNaN(Number(score))) {
      alert("Enter a valid number")
      return
    }

    if (Number(score) < 1 || Number(score) > 45) {
      alert("Score must be between 1 and 45")
      return
    }

    if (!user?.is_subscribed) {
    alert("Please subscribe to add scores")
    return
    }

    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (data && data.length >= 5) {
      await supabase
        .from("scores")
        .delete()
        .eq("id", data[0].id)
    }

    await supabase.from("scores").insert({
      user_id: user.id,
      score: Number(score),
      date: new Date().toISOString()
    })

    setScore("")
    fetchScores(user.id)
  }

  // 🎯 Run draw
//   const runDraw = async () => {
//   let numbers: number[] = []

//   while (numbers.length < 5) {
//     let num = Math.floor(Math.random() * 45) + 1
//     if (!numbers.includes(num)) {
//       numbers.push(num)
//     }
//   }

//   await supabase.from("draws").insert({
//     numbers
//   })

//   alert(`Draw created: ${numbers}`)
// }
// const runDraw = async () => {
//   if (!user) {
//     alert("Login first")
//     return
//   }

//   if (!user?.is_subscribed) {
//     alert("Subscribe to run draw")
//     return
//   }

//   const userScores = scores.map(s => s.score)

//   if (userScores.length < 5) {
//     alert("Add 5 scores first")
//     return
//   }

//   const numbers = userScores // test mode

//   const { error } = await supabase
//     .from("draws")
//     .insert({
//       numbers: numbers
//     })

//   if (error) {
//     console.log("DRAW INSERT ERROR:", error)
//     alert("Error creating draw")
//     return
//   }

//   alert("Draw created successfully ✅")
// }
  //   const runDraw = async () => {
  //   let numbers: number[] = []

  //   while (numbers.length < 5) {
  //     let num = Math.floor(Math.random() * 45) + 1
  //     if (!numbers.includes(num)) {
  //       numbers.push(num)
  //     }
  //   }

  //   const { error } = await supabase.from("draws").insert({
  //     numbers: numbers
  //   })

  //   if (error) {
  //     alert("Error creating draw")
  //   } else {
  //     alert(`Draw created: ${numbers}`)
  //   }
  // }
  const runDraw = async () => {
  const userScores = scores.map(s => s.score)

  if (userScores.length < 5) {
    alert("Add 5 scores first")
    return
  }

  if (!user?.is_subscribed) {
    alert("Subscribe to participate in draw")
    return
  }
  // 🔥 Force draw same as user scores
  const numbers = userScores

  await supabase.from("draws").insert({
    numbers: numbers
  })

  alert("Test Draw Created (Guaranteed Win!)")
}

  // 🏆 Check result + store winner
  const checkResult = async () => {
  if (!user) {
    alert("Please login again")
    return
  }

  if (!user?.is_subscribed) {
    alert("Subscribe to check results")
    return
  }

  const { data, error } = await supabase
    .from("draws")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)

  if (error) {
    console.log(error)
    alert("Error fetching draw")
    return
  }

  if (!data || data.length === 0) {
    alert("No draw yet")
    return
  }

  const drawNumbers = data[0].numbers
  const userScores = scores.map(s => s.score)

  const matchCount = userScores.filter((n: number) =>
    drawNumbers.includes(n)
  ).length

  let matchType = ""
  let amount = 0

  if (matchCount === 5) {
    matchType = "5-match"
    amount = 1000
  } else if (matchCount === 4) {
    matchType = "4-match"
    amount = 500
  } else if (matchCount === 3) {
    matchType = "3-match"
    amount = 200
  }

  if (matchType !== "") {
    // ✅ prevent duplicates
    const { data: existing } = await supabase
      .from("winners")
      .select("*")
      .eq("user_id", user.id)
      .eq("match_type", matchType)

    if (!existing || existing.length === 0) {
      const { error: insertError } = await supabase
        .from("winners")
        .insert({
          user_id: user.id,
          match_type: matchType,
          amount: amount,
          status: "pending"
        })

      if (insertError) {
        console.log(insertError)
      } else {
        fetchWinnings(user.id)
      }
    }
  }

  alert(`Draw: ${drawNumbers}\nResult: ${matchType || "No Match"}`)
}
  const handleSubscribe = async () => {
  if (!user) {
    alert("Please login first")
    return
  }

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: user.id
    })
  })

  if (!res.ok) {
    alert("Failed to start payment")
    return
  }

  const data = await res.json()

  if (!data?.url) {
    alert("Payment link error")
    return
  }

  window.location.href = data.url
}
  return (
  <div className="min-h-screen bg-gray-300 p-6">
    <div className="max-w-3xl mx-auto text-gray-600 shadow-lg rounded-xl p-6">

      <h1 className="text-3xl font-bold text-center mb-4">
        Golf Dashboard ⛳
      </h1>

      {user && (
        <p className="text-center text-gray-600 mb-4">
          Welcome, {user.email}
        </p>
      )}

      {user?.email?.toLowerCase() === "iramsara350@gmail.com" && (
      <div className="flex justify-center mb-4">
      <button
      className="bg-red-600 text-white px-4 py-2 rounded"
      onClick={() => window.location.href = "/admin"}
      >
      Go to Admin ⚙️
      </button>
      </div>
      )}

      {/* Add Score */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Enter score (1-45)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 rounded"
          onClick={addScore}
        >
          Add
        </button>
      </div>

      {/* Draw Buttons */}
      <div className="flex gap-2 justify-center mb-6">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={runDraw}
        >
          Run Draw 🎯
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={checkResult}
        >
          Check Result 🏆
        </button>
      </div>

      {/* Scores */}
      <div className="mb-6">
        <h2 className="font-bold text-lg mb-2">Your Scores</h2>
        <div className="grid grid-cols-2 gap-2">
          {scores.map((s, i) => (
            <div key={i} className="bg-gray-200 p-2 rounded text-center">
              {s.score}
            </div>
          ))}
        </div>
      </div>

      {/* Winnings */}
      <div>
        <h2 className="font-bold text-lg mb-2">Your Winnings</h2>
        {winnings.length === 0 && <p>No winnings yet</p>}

        {winnings.map((w, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <p className="font-semibold">{w.match_type}</p>
            <p>₹{w.amount}</p>
            <p className={w.status === "paid" ? "text-green-600" : "text-red-500"}>
              {w.status}
            </p>
          </div>
        ))}

        {!user?.is_subscribed ? (
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={handleSubscribe}
        >
        Subscribe 💳
        </button>
      ) : (
        <p className="text-green-600 font-semibold text-center">
           ✅ Subscription Active
        </p>
      )}
      </div>

    </div>
  </div>
)

  // return (
  //   <div className="flex flex-col items-center p-10 gap-4">
  //     <h1 className="text-2xl font-bold">Dashboard</h1>

  //     {user && <p>Welcome: {user.email}</p>}

  //     {/* Add Score */}
  //     <div className="flex gap-2">
  //       <input
  //         className="border p-2"
  //         placeholder="Enter score (1-45)"
  //         value={score}
  //         onChange={(e) => setScore(e.target.value)}
  //       />
  //       <button
  //         className="bg-black text-white px-4"
  //         onClick={addScore}
  //       >
  //         Add
  //       </button>
  //     </div>

  //     {/* Draw Buttons */}
  //     <div className="flex gap-2 mt-4">
  //       <button
  //         className="bg-green-600 text-white px-4 py-2"
  //         onClick={runDraw}
  //       >
  //         Run Draw 🎯
  //       </button>

  //       <button
  //         className="bg-blue-600 text-white px-4 py-2"
  //         onClick={checkResult}
  //       >
  //         Check Result 🏆
  //       </button>
  //     </div>

  //     {/* Scores */}
  //     <div className="mt-4">
  //       <h2 className="font-bold">Your Scores</h2>
  //       {scores.length === 0 && <p>No scores yet</p>}
  //       {scores.map((s, i) => (
  //         <p key={i}>
  //           {s.score} — {new Date(s.date).toLocaleDateString()}
  //         </p>
  //       ))}
  //     </div>

  //     {/* Winnings */}
  //     <div className="mt-6">
  //       <h2 className="font-bold">Your Winnings</h2>

  //       {winnings.length === 0 && <p>No winnings yet</p>}

  //       {winnings.map((w, i) => (
  //         <p key={i}>
  //           {w.match_type} — ₹{w.amount} — {w.status}
  //         </p>
  //       ))}
  //     </div>
  //   </div>
  // )
}