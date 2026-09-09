# BONDFIRE — Security & Threat Mitigation Policy
*Version: 1.0.0 | Security Rating: Hardened Enterprise Grade*

---

## 1. Threat Modeling (OWASP Top 10 & STRIDE Mitigations)

| Vulnerability / Attack Vector | Risk Level | Bondfire Production Defense |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | Critical | Every API request enforces Pod membership validation. Host-only endpoints (e.g. `START_GAME`) verify cryptographic session tokens against the database `pod_memberships.role` column. |
| **A02: Cryptographic Failures** | Critical | Sensitive media encrypted with AES-256 via client-scoped KMS keys. TLS 1.3 enforced for all HTTPS/WSS connections. HSTS headers preloaded. |
| **A03: Injection (SQL / XSS)** | High | 100% of database interactions use parameterized SQL statements. Client-side input passes through `sanitize()` HTML entity encoding before DOM insertion. |
| **A04: Insecure Design** | Medium | Zero model training guarantee. User photos are never exposed to public LLM datasets. Strict deletion policies propagate cascaded wipes across database and object storage. |
| **A05: Security Misconfiguration** | High | Fastify Helmet configured with strict CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and Referrer-Policy. |
| **A07: Identification & Auth Failures** | High | Google Identity Services (GSI) OAuth 2.0 with cryptographic JWT signature verification and 15-minute access token rotation. |
| **A09: Security Logging & Monitoring** | Medium | Centralized audit logs for room creations, memory uploads, deletions, and administrative actions. |

---

## 2. Zero-AI-Training Data Handling Guarantee
* User-uploaded chat screenshots and media are processed **exclusively in temporary memory buffers** for OCR text extraction and question structuring.
* We enforce explicit contractual terms via Google Cloud Enterprise / Vertex AI prohibiting any retention or secondary model training on customer payloads.

---

## 3. Vulnerability Disclosure & Bug Bounty
Security researchers may submit vulnerability reports directly to `security@bondfire.app`. Critical reports are acknowledged within 12 hours with automated triage.
