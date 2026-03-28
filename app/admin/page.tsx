"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Admin() {
  const [winners, setWinners] = useState<any[]>([])

  useEffect(() => {
    fetchWinners()
  }, [])

  const fetchWinners = async () => {
    const { data } = await supabase
      .from("winners")
      .select("*")
      .order("created_at", { ascending: false })

    setWinners(data || [])
  }

  const markAsPaid = async (id: string) => {
    await supabase
      .from("winners")
      .update({ status: "paid" })
      .eq("id", id)

    fetchWinners()
  }

  return (
    
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-blue-900 shadow rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-center">
            Admin Dashboard 🧑‍💼
          </h1>
          <p className="text-center text-gray-500">
            Manage winners and payouts
          </p>
        </div>

        {/* Winners Section */}
        <div className="bg-gray-600 shadow rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">
            Winners List 🏆
          </h2>

          {winners.length === 0 && (
            <p className="text-gray-500">No winners yet</p>
          )}

          <div className="grid gap-4">
            {winners.map((w, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                {/* Left Info */}
                <div>
                  <p className="text-sm text-gray-400">
                    User ID: {w.user_id.slice(0, 8)}...
                  </p>

                  <p className="font-semibold text-lg">
                    {w.match_type}
                  </p>

                  <p className="text-gray-200">
                    ₹{w.amount}
                  </p>
                </div>

                {/* Right Controls */}
                <div className="text-right">
                  <p
                    className={
                      w.status === "paid"
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {w.status}
                  </p>

                  {w.status === "pending" && (
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded mt-2 hover:bg-green-700"
                      onClick={() => markAsPaid(w.id)}
                    >
                      Mark Paid 💰
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}