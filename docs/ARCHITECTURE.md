# BONDFIRE — System Architecture Document (SAD)
*Version: 1.0.0 | Status: Active Production Blueprint*

---

## 1. System Topology & Tier Overview

Bondfire is architected as a distributed real-time social gaming and archival platform with three core tiers:

```
[ Edge Client (Next.js / Vanilla ES PWA) ]
                │
                ├─── HTTPS ───▶ [ Cloudflare Edge / Reverse Proxy ]
                │                      │
                │                      ├───▶ [ Fastify Node.js API Service ]
                │                      │         ├──▶ [ PostgreSQL 16+ Primary (Multi-Tenant) ]
                │                      │         └──▶ [ Cloudflare R2 / S3 Encrypted Media ]
                │                      │
                │                      └───▶ [ BullMQ Worker Queue ]
                │                                ├──▶ [ Google Cloud Vision OCR Engine ]
                │                                └──▶ [ Gemini 1.5/2.0 Flash Card Generator ]
                │
                └─── WSS ─────▶ [ Redis Pub/Sub Cluster + WebSocket Room Gateways ]
                                (Sub-50ms Synchronized Voting & Emoji Streams)
```

---

## 2. Architecture Decision Records (ADRs)

### ADR-01: Micro-State Reactive Signal Store vs. Heavy SPA Frameworks
* **Status:** Accepted.
* **Context:** The live second-screen experience requires instant load times (<100ms) on low-battery mobile phones without layout jank or heavy bundle downloads.
* **Decision:** We employ a lightweight, zero-dependency reactive Store pattern with `localStorage` persistence and cross-tab storage event synchronization.
* **Consequences:** Guests join in <3 seconds without downloading 300KB+ React runtimes; state rehydrates instantly after accidental page reloads.

### ADR-02: Asynchronous AI Deck Generation vs. Live Inference
* **Status:** Accepted.
* **Context:** Calling LLMs during live party rounds introduces 5–12 second latency spikes that kill game momentum.
* **Decision:** All AI parsing (OCR and question synthesis) occurs asynchronously when media is dropped into the Pod Vault. Live games pull exclusively from pre-generated, cached card decks.
* **Consequences:** Sub-50ms live round transitions; zero API rate-limit bottlenecks during peak evening party hours.

### ADR-03: Multi-Tenant Pod Encryption Scoping
* **Status:** Accepted.
* **Context:** Users upload personal photos and intimate WhatsApp chat screenshots.
* **Decision:** Every Pod receives a unique cryptographic encryption key (`Pod_KMS_Key`). Media files in object storage and database text extracts are isolated and never cross-pollinated or used for AI model training.

---

## 3. Database Normalization & Indexing Strategy
* **Normal Form:** 3NF across `users`, `pods`, `memberships`, `memories`, `rounds`, and `orders`.
* **Full-Text Search:** GIN index on `to_tsvector('english', ocr_extracted_text)` allows instant keyword retrieval across thousands of chat snippets.
* **Room Resolution:** Unique B-Tree index on `pods(room_code)` guarantees sub-2ms lobby lookups.
