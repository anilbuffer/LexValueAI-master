<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HIPAA & Multi-Tenant Compliance Rules
**BAA Signed: YES**

1. **Strict Multi-Tenancy (Firm Isolation):**
   - Every core database table/model MUST include a `firmId` foreign key.
   - All database queries (findMany, findUnique, update, delete) MUST explicitly filter by `firmId` to prevent cross-tenant data leakage. No exceptions.
   - Data from one firm MUST NEVER be accessible or visible to users of another firm.

2. **Data Privacy, Security & Zero-Breach Policy (HIPAA):**
   - **ZERO TOLERANCE FOR DATA BREACHES:** Absolutely no data leakage is acceptable. Protect all PHI/PII as if it is a life-or-death scenario.
   - Never log or expose Protected Health Information (PHI) or Personally Identifiable Information (PII) in console logs, error messages, or unauthenticated API endpoints.
   - **Node Packages:** Do NOT install unverified, risky, or untrusted npm packages that could compromise data security or cause data breaches. Audit dependencies before use. Only use highly trusted, widely used, production-ready packages.
   - Any external APIs used must be enterprise-grade and HIPAA-compliant.

3. **Code Quality & Production-Readiness:**
   - **Excellent Code Level:** Write clean, modular, and highly optimized production-grade code. Avoid hacky solutions.
   - **No Dead Code:** ALWAYS clean up unused imports, commented-out code (unless explicitly needed for reference), and useless/dead code before completing a task or preparing for a live push.
   - Fail securely: Ensure all errors are caught and handled gracefully without leaking stack traces to the frontend.

4. **General Agent Behavior:**
   - Before writing any database query or API endpoint, explicitly verify that `firmId` isolation is properly implemented.
   - Treat all case data, medical chronologies, and client details as highly sensitive PHI.
   - **Concise Communication:** Never provide long technical explanations, excuses, or details of *how* a problem was fixed unless explicitly asked. Keep responses extremely short (e.g., "Ho gaya hai" or "Done") and focus only on asking what to do next.
   - **Git Commits:** DO NOT commit or push code. The user will handle all commits and pushes. You should only generate and provide the commit message formatted according to the rules.
