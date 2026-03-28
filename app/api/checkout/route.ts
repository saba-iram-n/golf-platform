import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.json()

  const userId = body.userId   // ✅ extract properly

  if (!userId) {
    return NextResponse.json(
      { error: "User ID missing" },
      { status: 400 }
    )
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Golf Subscription"
          },
          unit_amount: 50000
        },
        quantity: 1
      }
    ],

    success_url: `http://localhost:3000/success?userId=${userId}`,
    cancel_url: "http://localhost:3000/dashboard"
  })

  return NextResponse.json({ url: session.url })
}