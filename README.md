# LexValu.ai

LexValu.ai is a secure, HIPAA-compliant legal case management and AI processing platform designed specifically for law firms. It features strict multi-tenant architecture, role-based access control (RBAC), and is architected to handle heavy AI-driven document analysis (like medical chronologies) via background processing.

## 🚀 Tech Stack

- **Framework:** Next.js (App Router), React
- **Styling:** TailwindCSS
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Security & Auth:** `bcryptjs` (Password hashing), `jose` (JWT Session Management)
- **Data Fetching:** SWR
- **UI Components:** `lucide-react` (Icons), `react-hot-toast` (Notifications)
- **Cloud Prep:** AWS SDK (Prepared for S3 storage and Lambda integrations)

## 🔐 Core Architecture & Security (HIPAA)

1. **Strict Multi-Tenancy:** Every core database model (`User`, `Case`, `Document`, `Settings`) is strictly tied to a `firmId`. The backend enforces that users can never access data outside their assigned firm.
2. **Role-Based Access Control (RBAC):**
   - `ADMIN`: System-wide access, can close any case.
   - `MANAGING_PARTNER`: Can manage cases created by themselves or anyone in their hierarchy (Attorneys and their Paralegals).
   - `ATTORNEY`: Can manage their own cases and cases created by Paralegals reporting to them.
   - `PARALEGAL`: Can create cases and upload documents, but cannot close cases or modify firm-wide settings.
3. **Data Retention & Session Management:** Configurable idle session timeouts and data retention periods per firm to maintain compliance.

## 📂 Project Structure & Flow

- `src/app/(dashboard)/*` - Protected frontend routes (Cases, Users, Settings, Timeline). Requires a valid JWT session.
- `src/app/actions/*` - **Next.js Server Actions**. The primary way the frontend communicates securely with the database (e.g., `cases.ts` for closing cases, `auth.ts` for login/session, `settings.ts` for profile updates).
- `src/app/api/*` - **REST API Routes**. Used for external integrations, webhooks, or complex data fetching.
- `src/components/*` - Reusable React components (Tables, Modals, Forms).
- `prisma/schema.prisma` - The source of truth for the PostgreSQL database schema.

## 📡 Key APIs and Server Actions

### Server Actions (`src/app/actions/`)
- `closeCase(caseId)`: Closes a case. Enforces strict RBAC (Checks if the user is in the correct hierarchy to close the case).
- `getFirmSettings()` & `updateFirmSettings()`: Manages firm-wide compliance policies.
- `login()` & `logout()`: Handles secure JWT generation and cookie destruction.

### REST APIs (`src/app/api/`)
- `GET /api/cases`: Fetches paginated cases for the dashboard. Automatically filters out cases the user does not have permission to view based on their role and hierarchy.
- `POST /api/cases`: Endpoint for Paralegals to create new case records.
- `POST /api/webhooks/aws-lambda`: **(Architecture Placeholder)** A webhook receiver designed to listen for incoming data from an external AWS Lambda function. When heavy PDFs are processed by AI in the cloud, the Lambda function will hit this endpoint with an `x-api-key` to update the case status and inject AI summaries/flags into the database.

## 🛠️ Getting Started

### 1. Environment Variables
Create a `.env` file in the root directory:
```env
# Your PostgreSQL connection string
DATABASE_URL="postgresql://postgres:root@localhost:5432/lex_value?schema=public"

# Future (Optional) - For AWS Lambda Webhook Security
# LAMBDA_API_KEY="your-secret-key"
```

### 2. Database Setup
Sync the Prisma schema with your database:
```bash
npx prisma db push
# or
npx prisma migrate dev
```

### 3. Run the Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
