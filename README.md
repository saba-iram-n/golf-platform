# ⛳ Golf Charity Subscription Platform

A full-stack subscription-based web application combining **golf performance tracking, monthly prize draws, and charitable giving**.

Built as part of a trainee evaluation assignment by **Digital Heroes**.

---

## 🚀 Live Demo

> (Add your Vercel link here)

---

## 📌 Project Overview

This platform allows users to:

* Subscribe via secure payment (Stripe)
* Enter and track their last 5 golf scores (Stableford format)
* Participate in monthly draw-based prize pools
* Win rewards based on score matching
* Contribute to charity through subscriptions

---

## 👥 User Roles

### 🔹 Public User

* View platform
* Signup / Login
* Subscribe

### 🔹 Registered User

* Enter golf scores (1–45)
* Participate in draws
* View winnings
* Manage subscription

### 🔹 Admin

* View all winners
* Mark payouts as completed

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Supabase (Auth + Database)
* **Payments:** Stripe
* **Deployment:** Vercel

---

## 💳 Subscription System

* Stripe Checkout integration
* Redirect-based payment flow
* Subscription status stored in Supabase
* Feature access controlled via `is_subscribed`

---

## 📊 Core Features

### ✅ Score Management

* Users can add scores (1–45)
* Only last 5 scores stored
* Oldest score auto-deleted

### 🎯 Draw System

* Random / test-based draw generation
* Match logic:

  * 5 match → ₹1000
  * 4 match → ₹500
  * 3 match → ₹200

### 🏆 Winner System

* Winners stored in database
* Status:

  * `pending`
  * `paid`

### 🔐 Access Control

* Non-subscribers can view dashboard
* Actions restricted until subscription

---

## 🧠 Key Engineering Decisions

* Used **Supabase Auth + custom users table**
* Implemented **Row Level Security (RLS) policies**
* Prevented duplicate winners
* Used **query-based subscription validation**
* Designed modular and scalable structure

---

## ⚠️ Known Limitations

* Payment success is simulated (no webhook verification)
* Admin role is email-based (not role table)
* Draw logic currently in test mode (matches user scores)

---

## 🔮 Future Improvements

* Real monthly draw automation
* Charity selection system
* Email notifications
* Admin analytics dashboard
* Secure role-based access control

---

## 🧪 Test Credentials

> (Add test user email/password)

---

## ⚙️ Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/YOUR_USERNAME/golf-charity-platform.git
cd golf-charity-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
STRIPE_SECRET_KEY=your_key
```

### 4. Run project

```bash
npm run dev
```

---

## 📂 Database Schema

### users

* id
* email
* is_subscribed

### scores

* id
* user_id
* score
* date

### draws

* id
* numbers (int[])

### winners

* id
* user_id
* match_type
* amount
* status

---

## 🎯 Evaluation Highlights

✔ Full-stack implementation
✔ Payment integration
✔ Database design
✔ Access control logic
✔ Clean UI & UX
✔ Scalable architecture

---

## 👩‍💻 Author

Saba Iram N
The National Institute of Engineering
Mysuru, India

---

## 📄 License

This project is for educational and evaluation purposes only.
