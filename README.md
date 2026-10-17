<div align="center">

# 🛡️ TrueDeed (LA-72)
### Algorithmic Land Fraud & Double-Selling Prevention Platform

[![Event: LandTech Hackathon 2026](https://img.shields.io/badge/Event-LandTech_2026_Hackathon-10b981?style=for-the-badge&logo=target&logoColor=white)](https://github.com/Ishtiak-Ahmed886/TrueDeed)
[![Track: Digital Land Records](https://img.shields.io/badge/Track-Digital_Land_Records-0284c7?style=for-the-badge&logo=database&logoColor=white)](https://github.com/Ishtiak-Ahmed886/TrueDeed)
[![Problem: P3 Catch Fraud](https://img.shields.io/badge/Problem-P3_Fraud_%26_Double_Selling-e11d48?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/Ishtiak-Ahmed886/TrueDeed)
[![License: MIT](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](LICENSE)

<br/>

**[📄 Read Official 4-Page Concept Note (PDF)](./TrueDeed_Concept_Note_Official.pdf)** &nbsp;•&nbsp;
**[🏛️ Interactive Architecture Gallery](./Architecture_and%20Data_flow/Architecture_Gallery.html)** &nbsp;•&nbsp;
**[📐 Modern Architecture](#-2-modern-system-architecture)** &nbsp;•&nbsp;
**[👥 Team & Mentors](#-8-team--mentorship-rule-book-section-6)**

---

</div>

## 📌 1. Executive Summary & National Urgency

Over **70% of all civil litigations in Bangladesh**—representing approximately **3.5 million pending cases** in formal courts—originate from land ownership disputes, forged deeds, and unauthorized transfers. 

### The Institutional Void
The root cause is a systemic institutional disconnect between two distinct government authorities:
1. **The Ministry of Law (Sub-Registry Offices):** Exercises statutory authority over deed registration under the *Registration Act 1908*, but lacks automated visibility into live khatian mutation statuses or physical boundary encumbrances.
2. **The Ministry of Land (Upazila Land Offices / AC Land):** Administers mutation records (*e-Namjari*) and revenue records (*e-Porcha*), but historically operates asynchronously from registration desks.

Under **Problem P3: Catch Fraud & Double-Selling**, **TrueDeed** builds an automated, sub-second pre-registration verification layer. It intercepts fraudulent land sales **before** registration by mathematically auditing statutory inheritance quotas, validating Baya deed chain-of-title lineage, and enforcing real-time transactional concurrency locks.

---

## 🏛️ 2. Modern System Architecture

The following diagram illustrates the complete, end-to-end multi-layer architecture of TrueDeed—from physical Bengali deed ingestion to automated algorithmic verification and QR-verifiable certificate dispatch:

<p align="center">
  <img src="./modern_system_architecture.png" alt="TrueDeed Modern System Architecture" width="100%">
</p>

---

## ⚡ 3. Five Targeted Core Innovations

TrueDeed delivers five targeted technological modules resolving Problem P3 at the national administrative level:

| # | Innovation Module | Legal & Algorithmic Foundation | Fraud Vector Prevented |
|---|-------------------|--------------------------------|------------------------|
| **1** | **Farayez Statutory Inheritance Quota Interceptor** | Enforces fractional inheritance calculations under Islamic jurisprudence (*Aul*, *Radd*, and the *Muslim Family Laws Ordinance 1961*). | Blocks heirs from selling more than their lawful fractional share or disinheriting female co-heirs. |
| **2** | **DAG Baya Deed Lineage Tracer** | Constructs a Directed Acyclic Graph tracing unbroken ownership from state survey baselines (CS/SA/RS) to current seller. | Identifies fake intermediate deeds, missing mutation orders, and broken seller-buyer continuity. |
| **3** | **45-Day Temporal Concurrency Plot Lock** | Places an active transactional hold across all registration desks during the statutory e-mutation window. | Eliminates double-selling scams where dishonest owners sell the same plot to multiple buyers within days. |
| **4** | **Multimodal Bangla Legal OCR & Normalizer** | Employs Google Gemini 2.0 Flash Vision API and OpenCV to parse archaic, handwritten Bengali deeds into normalized JSON schemas. | Eliminates manual clerical transcription errors and boundary manipulation. |
| **5** | **Composite TrueDeed Trust Score (0–100%)** | Weighted 100-point security metric backed by hard fail-safe vetoes (e.g., Order 39 CPC injunctions, broken Baya chain). | Generates a tamper-evident digital verification certificate with QR-verifiable cryptographic proof. |

---

## 📊 4. Trust Score Matrix & Fail-Safe Veto Rules

TrueDeed calculates a deterministic, explainable risk index (0–100%) based on five transparent verification pillars:

```
┌─────────────────────────────────────────────────────────┐
│              TrueDeed Trust Score (100 Pts)             │
├─────────────────────────────────────────────────────────┤
│ [25 Pts] Inheritance & Farayez Quota Legitimacy        │
│ [25 Pts] Baya Deed Lineage & Root Chain Continuity      │
│ [20 Pts] Cadastral Boundary & Spatial Match (Daag/Mouza)│
│ [15 Pts] Mutation & DCR Upazila Verification            │
│ [15 Pts] Encumbrance & Active Concurrency Lock Status    │
└─────────────────────────────────────────────────────────┘
```

### 🛑 Hard Fail-Safe Vetoes (Immediate Disqualification)
Regardless of the cumulative score, the transaction is immediately flagged with a **CRITICAL FRAUD VETO (Score = 0)** if any of the following are detected:
- ❌ **Active Civil Court Injunction** (Under *Order 39, Code of Civil Procedure 1908*).
- ❌ **Broken Baya Lineage** (Seller cannot prove unbroken chain of title back to recorded Khatian).
- ❌ **Farayez Quota Breach** (Selling acreage exceeds legally calculated inheritance quota).
- ❌ **Active Concurrency Lock Violation** (Deed already lodged for the same plot within the 45-day mutation window).

---

## 📐 5. Detailed Architecture & Data Flow Showcase

Explore the modular technical blueprints and sequence data flows for each verification pillar:

> 💡 **Tip:** Click any section to expand, or open the **[🏛️ Interactive Architecture Gallery](./Architecture_and%20Data_flow/Architecture_Gallery.html)** in your browser for full-screen viewing.

<details open>
<summary><b>Module 1: Farayez Inheritance Fraud Prevention</b></summary>
<br>

| Architecture Blueprint | Sequence Data Flow |
| :---: | :---: |
| [![Farayez Architecture](./Architecture_and%20Data_flow/1.Inheritance_Fraud_Prevention_Architecture.svg)](./Architecture_and%20Data_flow/1.Inheritance_Fraud_Prevention_Architecture.svg) | [![Farayez Dataflow](./Architecture_and%20Data_flow/1.Inheritance_Fraud_Prevention_Dataflow.svg)](./Architecture_and%20Data_flow/1.Inheritance_Fraud_Prevention_Dataflow.svg) |
| [🔍 Full Tab HD View](./Architecture_and%20Data_flow/1.Inheritance_Fraud_Prevention_Architecture.svg) | [🔍 Full Tab HD View](./Architecture_and%20Data_flow/1.Inheritance_Fraud_Prevention_Dataflow.svg) |

</details>

<details open>
<summary><b>Module 2: Baya Deed Lineage (Chain of Ownership Verification)</b></summary>
<br>

| Architecture Blueprint | Sequence Data Flow |
| :---: | :---: |
| [![Baya Architecture](./Architecture_and%20Data_flow/2.Chain_of_Ownership_Verification_Architecture.svg)](./Architecture_and%20Data_flow/2.Chain_of_Ownership_Verification_Architecture.svg) | [![Baya Dataflow](./Architecture_and%20Data_flow/2.Chain_of_Ownership_Verification_Dataflow.svg)](./Architecture_and%20Data_flow/2.Chain_of_Ownership_Verification_Dataflow.svg) |
| [🔍 Full Tab HD View](./Architecture_and%20Data_flow/2.Chain_of_Ownership_Verification_Architecture.svg) | [🔍 Full Tab HD View](./Architecture_and%20Data_flow/2.Chain_of_Ownership_Verification_Dataflow.svg) |

</details>

<details open>
<summary><b>Module 3: Double-Selling Prevention (Temporal Active Plot Lock)</b></summary>
<br>

| Architecture Blueprint | Sequence Data Flow |
| :---: | :---: |
| [![Lock Architecture](./Architecture_and%20Data_flow/3.Double_Selling_Prevention_Architecture.svg)](./Architecture_and%20Data_flow/3.Double_Selling_Prevention_Architecture.svg) | [![Lock Dataflow](./Architecture_and%20Data_flow/3.Double_Selling_Prevention_Dataflow.svg)](./Architecture_and%20Data_flow/3.Double_Selling_Prevention_Dataflow.svg) |
| [🔍 Full Tab HD View](./Architecture_and%20Data_flow/3.Double_Selling_Prevention_Architecture.svg) | [🔍 Full Tab HD View](./Architecture_and%20Data_flow/3.Double_Selling_Prevention_Dataflow.svg) |

</details>

<details open>
<summary><b>Module 4: Bangla Legal Document OCR & Entity Extraction</b></summary>
<br>

| Architecture Blueprint | Sequence Data Flow |
| :---: | :---: |
| [![OCR Architecture](./Architecture_and%20Data_flow/4.Bangla_Legal_OCR_Architecture.svg)](./Architecture_and%20Data_flow/4.Bangla_Legal_OCR_Architecture.svg) | [![OCR Dataflow](./Architecture_and%20Data_flow/4.Bangla_Legal_OCR_Dataflow.svg)](./Architecture_and%20Data_flow/4.Bangla_Legal_OCR_Dataflow.svg) |
| [🔍 Full Tab HD View](./Architecture_and%20Data_flow/4.Bangla_Legal_OCR_Architecture.svg) | [🔍 Full Tab HD View](./Architecture_and%20Data_flow/4.Bangla_Legal_OCR_Dataflow.svg) |

</details>

<details open>
<summary><b>Module 5: TrueDeed Composite Trust Score & QR Verification Certificate</b></summary>
<br>

| Architecture Blueprint | Sequence Data Flow |
| :---: | :---: |
| [![Trust Score Architecture](./Architecture_and%20Data_flow/5.TrueDeed_Trust_Score_Architecture.svg)](./Architecture_and%20Data_flow/5.TrueDeed_Trust_Score_Architecture.svg) | [![Trust Score Dataflow](./Architecture_and%20Data_flow/5.TrueDeed_Trust_Score_Dataflow.svg)](./Architecture_and%20Data_flow/5.TrueDeed_Trust_Score_Dataflow.svg) |
| [🔍 Full Tab HD View](./Architecture_and%20Data_flow/5.TrueDeed_Trust_Score_Architecture.svg) | [🔍 Full Tab HD View](./Architecture_and%20Data_flow/5.TrueDeed_Trust_Score_Dataflow.svg) |

</details>

---

## 💻 6. Technology Stack & Specifications

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend UI** | React | 19.x | Modern, responsive single-page portal with dual English/Bangla localization. |
| **Styling & Icons** | Tailwind CSS & Lucide Icons | Latest | Clean, accessible government-grade design system. |
| **Backend API** | FastAPI (Python) | 3.10+ | Asynchronous, sub-second title evaluation microservices. |
| **Graph Lineage Engine** | NetworkX | 3.x | Directed Acyclic Graph (DAG) for deep multi-generational Baya deed traversal. |
| **VLM & Document OCR** | Google Gemini 2.0 Flash Vision API | Latest | Multimodal perception parsing archaic, handwritten Bengali deeds. |
| **Image Preprocessing** | OpenCV | 4.x | Adaptive binarization, deskewing, and noise filtering for physical deed scans. |
| **Concurrency Locks** | Redis / In-Memory Mutex | 7.x | 45-day atomic mutex locks indexed by composite cadastral keys. |
| **Cryptographic Proof** | PyCryptodome / Hashlib | Built-in | SHA-256 Merkle tree verification and QR-verifiable digital certificates. |

---

## 🔒 7. Data Privacy & Hackathon Rule Compliance

In strict compliance with **Section 10 (Do's and Don'ts)** and **Section 14 (FAQ)** of the LandTech 2026 Rule Book:

- 🛡️ **Zero Real Personal Data Used:** This project **does not** utilize real citizens' names, National Identity (NID) numbers, biometric data, phone numbers, or actual confidential land records.
- 🧪 **100% Synthetic Dummy Datasets:** All demonstration datasets, Khatian entries, and sample deed documents are synthetically modeled after standard public Sub-Registry deed templates (*সাফ কবলা*) and historical survey schemas (*CS, SA, RS, e-Porcha*).
- 🚫 **Zero Government System Scraping:** No live government servers (*land.gov.bd*, *minland.gov.bd*, etc.) were scraped, load-tested, or accessed. All integration is demonstrated via mock API contracts.
- 🤖 **AI Transparency Disclosure (Rule Book Section 8 & 10):**
  - **Google Gemini 2.0 Flash Vision API:** Utilized for multimodal extraction from unstructured legal Bengali deed images.
  - **OpenCV:** Employed for deterministic computer vision image preprocessing.
  - **Antigravity & ChatGPT:** Utilized as pair-programming and documentation assistants for algorithmic formulation and architecture design.

---

## 👥 8. Team & Mentorship (Rule Book Section 6)

| Role | Name | Department / Affiliation | Institutional ID / Designation |
|---|---|---|---|
| **Student 1 (Team Leader)** | **ISHTIAK AHMED** | Dept. of Computer Science & Engineering, Daffodil International University | **Student ID:** `0242310005101006` |
| **Student 2 (Core Member)** | **Ashfikur Rahman Mahi** | Dept. of Computer Science & Engineering, Daffodil International University | **Student ID:** `0242310005101618` |
| **Faculty Mentor** | **Md. Jubayar Alam Rafi** | Dept. of Computer Science & Engineering, Daffodil International University | **Designation:** Assistant Professor |
| **Industry Support Mentor** | **MD Zafor Iqbal** | Zafor IT System | **Designation:** Managing Director |

---

## 📁 9. Repository Structure

```text
TrueDeed/
├── Architecture_and Data_flow/             # High-definition vector blueprints & dataflows
│   ├── 1.Inheritance_Fraud_Prevention_Architecture.svg
│   ├── 1.Inheritance_Fraud_Prevention_Dataflow.svg
│   ├── 2.Chain_of_Ownership_Verification_Architecture.svg
│   ├── 2.Chain_of_Ownership_Verification_Dataflow.svg
│   ├── 3.Double_Selling_Prevention_Architecture.svg
│   ├── 3.Double_Selling_Prevention_Dataflow.svg
│   ├── 4.Bangla_Legal_OCR_Architecture.svg
│   ├── 4.Bangla_Legal_OCR_Dataflow.svg
│   ├── 5.TrueDeed_Trust_Score_Architecture.svg
│   ├── 5.TrueDeed_Trust_Score_Dataflow.svg
│   └── Architecture_Gallery.html           # Full-screen interactive visual gallery
├── modern_system_architecture.png          # High-resolution master architecture diagram
├── TrueDeed_Concept_Note_Official.pdf      # Official 4-page hackathon submission PDF
├── TrueDeed_Concept_Note_4Pages.html       # Print-perfect HTML source for concept note
├── LICENSE                                 # Open-source MIT License
├── README.md                               # Project documentation & evaluator guide
└── .gitignore                              # Git exclusion rules
```

---

## 🚀 10. Execution Roadmap & Hackathon Milestones

```text
Phase 1: Concept Note & System Architecture (Current Phase)
  ├── Problem P3 Rigorous Formulation & Legal Jurisprudence Mapping [COMPLETED]
  ├── End-to-End System Architecture & High-Resolution Vector Blueprints [COMPLETED]
  ├── Official 4-Page Concept Note Formulation & Submission [COMPLETED]
  └── GitHub Open-Source Documentation & Architecture Gallery Setup [COMPLETED]

Phase 2: Working Prototype & Video Demonstration
  ├── FastAPI Backend Microservices & Algorithmic Farayez Engine Integration
  ├── NetworkX Baya Deed DAG Lineage Tracer & Temporal Concurrency Mutex
  ├── React 19 Frontend Dashboard with Side-by-Side OCR Verification Screen
  └── 3-Minute High-Impact Demonstration Video & Pitch Deck

Phase 3: National Scale Deployment & Ministry Sandbox
  ├── Dual Sub-Registry & AC Land e-Mutation Webhook Integration Sandbox
  └── QR-Verifiable Cryptographic Proof Generation for Citizen Verifications
```

---

<div align="center">
  <sub>Developed with pride by Team <b>TrueDeed (LA-72)</b> for the <b>DIU LandTech Innovation Hackathon 2026</b>.</sub>
</div>
