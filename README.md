
```markdown
<p align="center">
  <b>Backend System simulating real-world fintech transaction infrastructure.</b>
</p>
### 💳 Banking Ledger System
Production-Grade Backend for Secure Money Transfers

## 🚀 Overview
The Banking Ledger System is a backend-focused fintech simulation designed with production-level engineering principles.

It enables secure account creation and atomic money transfers between accounts while ensuring:
● 🔒 Authentication & Authorization
● 🔁 Idempotent Transactions (Duplicate Prevention)
● 💰 Atomic Balance Updates
● 📜 Immutable Ledger Records
● 🚫 Token Blacklisting (Secure Logout)
● 📧 Email Notifications
● 🛡 Concurrency & Double-Spend Protection

## 🏗 Architecture & Tech Stack
### 🔹 Backend

● Node.js
● Express.js
● MongoDB Atlas
● Mongoose ODM

### 🔹 Security

● JWT Authentication
● HTTP-only Cookies
● Token Blacklisting
● Password Hashing (bcrypt)

###🔹 Utilities

● Nodemailer (Email Service)
● MongoDB Transactions (Sessions)

## 📂 Project Structure
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── account.controller.js
│   │   ├── auth.controller.js
│   │   └── transaction.controller.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── account.model.js
│   │   ├── blacklist.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── account.routes.js
│   │   ├── auth.routes.js
│   │   └── transaction.routes.js
│   │
│   ├── services/
│   │   └── email.service.js
│   │
│   └── app.js
│
├── server.js
├── package.json
└── .env

## 🔐 Authentication & Security

✅ Features
● User Registration
● Secure Login (JWT issued)
● Protected Routes via Middleware
● Token Blacklisting on Logout
● Password Hashing with bcrypt
● HTTP-only cookie handling

## 🔒 Blacklist Model

Invalidated tokens are stored in blacklist.model.js to prevent reuse after logout.

## 🏦 Account Management

● Create bank accounts
● Retrieve account details
● Validate account ownership
● Balance tracking per account

## 💸 Transaction Engine (Core Feature)
### 🔁 Idempotency Handling

Each transaction requires an idempotencyKey.
If the same request is retried:
●  Existing transaction is returned
●  Duplicate debit is prevented
This simulates real payment gateway protection.

### 🔄 Atomic Transfers

Money transfer uses MongoDB sessions:
●  Validate sender balance
●  Debit sender account
●  Credit receiver account
● Create transaction record
●  Create ledger entry
●  Commit transaction
If any step fails → rollback automatically.

## 📜 Ledger System (Immutable Audit Trail)

Each transfer creates:
● Debit entry
● Credit entry
● Linked transaction reference
● Timestamp

Ledger acts as:
● Financial audit system
● Source of truth
● Transaction history log

## 📧 Email Notification System

Upon successful transaction:
● Confirmation email sent
● Includes amount & account details
● Simulates real banking notification behavior

## 🛡 Edge Cases Covered

1) Duplicate API retry: Idempotency key validation
2) Insufficient balance: Transaction rejected
3) Invalid account:	Validation before execution
4) Token reuse after logout:	Blacklist verification
5) Partial DB failure:	MongoDB session rollback
6) Concurrent transfers:	Atomic DB transactions


## ⚡ API Endpoints

🔐 Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

🏦 Accounts

POST   /api/accounts
GET    /api/accounts/:id
GET    /api/accounts/user/:userId

💸 Transactions

POST   /api/transactions

Request Body
```json
{
  "fromAccount": "accountId1",
  "toAccount": "accountId2",
  "amount": 1000,
  "idempotencyKey": "unique-key-xyz"
}

## 🐳 Running Locally
🔧 Prerequisites
● Node.js (v18+)
● MongoDB Atlas
● npm

1️⃣ Clone Repository

```markdown
```bash
git clone <your-repo-url>
cd backend
npm install

2️⃣ Configure Environment

Create .env file:
```markdown
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

3️⃣ Start Server

```markdown
```bash
git clone <your-repo-url>
cd backend
npm install

### Server runs at:

🔗 [http://localhost:3000](http://localhost:3000)

## 🧠 Why This Project Demonstrates Production-Ready Backend Skills

● Financial data consistency handling
●Transactional database design
● Idempotency implementation
● Secure authentication architecture
● Concurrency-safe operations
● Modular scalable folder structure





