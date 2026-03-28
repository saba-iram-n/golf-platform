import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
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
          unit_amount: 50000 // ₹500
        },
        quantity: 1
      }
    ],
    success_url: "http://localhost:3000/dashboard",
    cancel_url: "http://localhost:3000/dashboard"
  })

  return NextResponse.json({ url: session.url })
}